import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import type { Repository } from "typeorm";
import { RatingController } from "../src/controller/rating.controller.js";
import { Member } from "../src/entity/member.entity.js";
import { Rating } from "../src/entity/rating.entity.js";
import { RatingService } from "../src/service/rating.service.js";
import { createTestApp } from "./support/create-test-app.js";

// [필수 미션] POST /ratings가 토큰 유무에 따라 401과 201로 나뉘는지 실제 요청으로 확인해요.
describe("평점 API (통합 테스트)", () => {
  let app: INestApplication;
  let ratingRepository: Repository<Rating>;
  let authorization: string;

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [RatingController],
      providers: [RatingService],
    });

    const memberRepository = app.get<Repository<Member>>(getRepositoryToken(Member));
    ratingRepository = app.get(getRepositoryToken(Rating));

    const member = await memberRepository.save(
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
    await ratingRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it("토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답하고 평점을 저장하지 않는다", async () => {
    const response = await request(app.getHttpServer())
      .post("/ratings")
      .send({ movieId: 550, score: 5, comment: "인생 영화예요." })
      .expect(401);

    expect(response.body).toEqual({
      isSuccess: false,
      code: "AUTH401_2",
      message: "로그인이 필요한 요청입니다.",
      result: null,
    });
    expect(await ratingRepository.count()).toBe(0);
  });

  it("토큰을 담아 평점을 등록하면 201과 저장된 평점을 응답한다", async () => {
    const response = await request(app.getHttpServer())
      .post("/ratings")
      .set("Authorization", authorization)
      .send({ movieId: 550, score: 5, comment: "인생 영화예요." })
      .expect(201);

    expect(response.body.code).toBe("COMMON201");
    expect(response.body.result).toMatchObject({ movieId: 550, score: 5, comment: "인생 영화예요." });
    expect(await ratingRepository.count()).toBe(1);
  });
});
