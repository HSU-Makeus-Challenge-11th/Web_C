import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import { type ObjectLiteral, Repository } from "typeorm";
import { MovieRecordController } from "../src/controller/movie-record.controller.js";
import { Favorite } from "../src/entity/favorite.entity.js";
import { Member } from "../src/entity/member.entity.js";
import { Rating } from "../src/entity/rating.entity.js";
import { MovieRecordService } from "../src/service/movie-record.service.js";
import { createTestApp } from "./support/create-test-app.js";

// [선택 미션] POST /movie-records가 정말 하나의 트랜잭션으로 묶여 있는지 증명해요.
// "예외가 났다"에서 멈추지 않고, 실패한 요청이 평점을 남기지 않았는지(rollback)까지 확인해요.
describe("영화 기록 API 트랜잭션 (통합 테스트)", () => {
  let app: INestApplication;
  let ratingRepository: Repository<Rating>;
  let favoriteRepository: Repository<Favorite>;
  let member: Member;
  let authorization: string;

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [MovieRecordController],
      providers: [MovieRecordService],
    });

    const memberRepository = app.get<Repository<Member>>(getRepositoryToken(Member));
    ratingRepository = app.get(getRepositoryToken(Rating));
    favoriteRepository = app.get(getRepositoryToken(Favorite));

    member = await memberRepository.save(
      memberRepository.create({
        email: "challenger@umc.com",
        password: "$2b$10$abcdefghijklmnopqrstuv",
        nickname: "영화조아",
      }),
    );
    const token = app.get(JwtService).sign({ sub: String(member.memberId), email: member.email });
    authorization = `Bearer ${token}`;
  });

  beforeEach(async () => {
    await favoriteRepository.clear();
    await ratingRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it("이미 즐겨찾기한 영화에 addToFavorites true로 기록하면 409 FAVORITE409_1이고 평점도 남지 않는다", async () => {
    // given: 550번 영화를 이미 즐겨찾기해 둔 상황
    await favoriteRepository.save(favoriteRepository.create({ member, movieId: 550 }));
    const ratingCountBefore = await ratingRepository.count();

    // when: 같은 영화에 평점 + 즐겨찾기를 함께 저장하면
    const response = await request(app.getHttpServer())
      .post("/movie-records")
      .set("Authorization", authorization)
      .send({ movieId: 550, score: 5, comment: "다시 보고 싶어요.", addToFavorites: true })
      .expect(409);

    // then: 즐겨찾기 중복으로 실패하고, 먼저 저장하려던 평점도 되돌려져 개수가 그대로다
    expect(response.body.code).toBe("FAVORITE409_1");
    expect(await ratingRepository.count()).toBe(ratingCountBefore);
    expect(await favoriteRepository.count()).toBe(1);
  });

  // 위 테스트는 서비스가 평점을 저장하기 "전에" 즐겨찾기 중복을 확인해서 막기 때문에, 트랜잭션이 없어도 통과해요.
  // 진짜 rollback을 증명하려면 평점 INSERT가 끝난 "뒤에" 즐겨찾기 INSERT가 실패해야 해요.
  // 동시에 들어온 두 요청이 모두 중복 확인을 통과한 상황을, 즐겨찾기 중복 확인이 한 번만 false를 돌려주게 해서 재현해요.
  it("중복 확인을 통과한 뒤 즐겨찾기 INSERT가 UNIQUE 제약에 막히면 먼저 저장한 평점까지 rollback된다", async () => {
    // given: 이미 즐겨찾기한 영화인데, 서비스의 중복 확인은 "없다"고 잘못 판단하는 상황
    await favoriteRepository.save(favoriteRepository.create({ member, movieId: 550 }));
    // 원래 메서드는 아래에서 apply(this, ...)로 원래 Repository에 묶어 부르므로 unbound 경고를 꺼요.
    // oxlint-disable-next-line typescript/unbound-method
    const originalExists = Repository.prototype.exists;
    const existsSpy = vi.spyOn(Repository.prototype, "exists").mockImplementation(function (
      this: Repository<ObjectLiteral>,
      ...args: Parameters<Repository<ObjectLiteral>["exists"]>
    ) {
      if (this.metadata.target === Favorite) return Promise.resolve(false);
      return originalExists.apply(this, args);
    });

    try {
      // when: 평점 + 즐겨찾기를 함께 저장하면 (평점 INSERT 성공 → 즐겨찾기 INSERT가 UNIQUE 제약 위반)
      const response = await request(app.getHttpServer())
        .post("/movie-records")
        .set("Authorization", authorization)
        .send({ movieId: 550, score: 5, comment: "다시 보고 싶어요.", addToFavorites: true });

      // then: 요청은 실패하고, 이미 INSERT했던 평점도 되돌려져 하나도 남지 않는다
      // (MySQL에서는 전역 필터가 ER_DUP_ENTRY를 409로 바꾸지만, 테스트용 SQLite 오류는 그 대상이 아니라 상태 코드는 확인하지 않아요.)
      expect(response.body.isSuccess).toBe(false);
      expect(await ratingRepository.count()).toBe(0);
      expect(await favoriteRepository.count()).toBe(1);
    } finally {
      existsSpy.mockRestore();
    }
  });

  it("평점과 즐겨찾기를 함께 저장하면 201이고 둘 다 저장된다", async () => {
    const response = await request(app.getHttpServer())
      .post("/movie-records")
      .set("Authorization", authorization)
      .send({ movieId: 238, score: 5, comment: "명작이에요.", addToFavorites: true })
      .expect(201);

    expect(response.body.result.rating).toMatchObject({ movieId: 238, score: 5 });
    expect(response.body.result.favorite).toMatchObject({ movieId: 238 });
    expect(await ratingRepository.count()).toBe(1);
    expect(await favoriteRepository.count()).toBe(1);
  });
});
