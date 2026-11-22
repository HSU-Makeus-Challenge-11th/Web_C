import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import type { Repository } from "typeorm";
import { FavoriteController } from "../src/controller/favorite.controller.js";
import { Favorite } from "../src/entity/favorite.entity.js";
import { Member } from "../src/entity/member.entity.js";
import { FavoriteService } from "../src/service/favorite.service.js";
import { createTestApp } from "./support/create-test-app.js";

// [실습 5] 진짜 HTTP 요청을 보내 인증(Guard) → 검증(ValidationPipe) → 서비스 → DB 저장 → 오류 응답(필터)까지 확인해요.
// DB는 개발용 MySQL이 아니라 테스트가 돌 때만 메모리에 만들어지는 SQLite(sql.js)예요.
describe("즐겨찾기 API (통합 테스트)", () => {
  let app: INestApplication;
  let memberRepository: Repository<Member>;
  let favoriteRepository: Repository<Favorite>;
  let member: Member;
  let authorization: string;

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [FavoriteController],
      providers: [FavoriteService],
    });

    memberRepository = app.get(getRepositoryToken(Member));
    favoriteRepository = app.get(getRepositoryToken(Favorite));

    // 로그인한 회원이 있어야 하므로 회원을 한 명 저장하고 토큰을 직접 발급해요.
    member = await memberRepository.save(
      memberRepository.create({
        email: "challenger@umc.com",
        password: "$2b$10$abcdefghijklmnopqrstuv", // 로그인 API를 거치지 않으므로 아무 값이나 괜찮아요.
        nickname: "영화조아",
      }),
    );
    const token = app.get(JwtService).sign({ sub: String(member.memberId), email: member.email });
    authorization = `Bearer ${token}`;
  });

  beforeEach(async () => {
    // 앞 테스트가 남긴 즐겨찾기를 지워서, 테스트끼리 서로 영향을 주지 않게 해요.
    await favoriteRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it("토큰 없이 즐겨찾기를 등록하면 401과 AUTH401_2를 응답한다", async () => {
    const response = await request(app.getHttpServer()).post("/favorites").send({ movieId: 550 }).expect(401);

    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe("AUTH401_2");
  });

  it("토큰을 담아 즐겨찾기를 등록하면 201과 저장된 영화 ID를 응답한다", async () => {
    const response = await request(app.getHttpServer())
      .post("/favorites")
      .set("Authorization", authorization)
      .send({ movieId: 550 })
      .expect(201);

    expect(response.body.code).toBe("COMMON201");
    expect(response.body.result.movieId).toBe(550);
  });

  it("이미 즐겨찾기한 영화를 다시 등록하면 409와 FAVORITE409_1을 응답한다", async () => {
    await favoriteRepository.save(favoriteRepository.create({ member, movieId: 550 }));

    const response = await request(app.getHttpServer())
      .post("/favorites")
      .set("Authorization", authorization)
      .send({ movieId: 550 })
      .expect(409);

    expect(response.body.code).toBe("FAVORITE409_1");
  });

  it("즐겨찾기하지 않은 영화의 여부를 조회하면 200과 isFavorite false를 응답한다", async () => {
    const response = await request(app.getHttpServer())
      .get("/favorites/550")
      .set("Authorization", authorization)
      .expect(200);

    expect(response.body.result.isFavorite).toBe(false);
  });
});
