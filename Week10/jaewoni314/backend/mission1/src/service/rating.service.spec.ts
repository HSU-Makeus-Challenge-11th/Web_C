import { Test, type TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";
import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";
import { RatingService } from "./rating.service.js";

// [필수 미션] RatingService의 판단 두 가지(중복 등록 409, 남의 평점 수정 403)를 DB 없이 확인해요.
describe("RatingService (단위 테스트)", () => {
  let ratingService: RatingService;

  const ratingRepository = {
    exists: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
  const memberRepository = {
    findOneBy: vi.fn(),
  };

  const writer = { memberId: 1, nickname: "영화조아" } as Member;
  const otherMember = { memberId: 2, nickname: "다른사람" } as Member;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    ratingService = module.get(RatingService);
  });

  it("같은 영화에 평점을 중복 등록하면 RATING409_1 예외를 던지고 저장하지 않는다", async () => {
    // given: 회원이 이미 550번 영화에 평점을 남긴 상황
    memberRepository.findOneBy.mockResolvedValue(writer);
    ratingRepository.exists.mockResolvedValue(true);

    // when: 같은 영화에 평점을 다시 등록하면
    const promise = ratingService.create(1, { movieId: 550, score: 5, comment: "또 봐도 좋아요." });

    // then: 409 RATING409_1이 나고, 저장은 시도하지 않는다
    await expect(promise).rejects.toBeInstanceOf(ApiException);
    await expect(promise).rejects.toMatchObject({ error: ErrorCodes.RATING_DUPLICATED });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it("남이 쓴 평점을 수정하려 하면 RATING403_1 예외를 던지고 수정하지 않는다", async () => {
    // given: 10번 평점은 1번 회원이 쓴 평점인 상황
    const rating = { ratingId: 10, movieId: 550, score: 4, comment: "재밌어요.", member: writer } as Rating;
    ratingRepository.findOne.mockResolvedValue(rating);

    // when: 2번 회원이 그 평점을 수정하려 하면
    const promise = ratingService.update(otherMember.memberId, 10, { score: 1, comment: "별로예요." });

    // then: 403 RATING403_1이 나고, 원래 평점은 바뀌지 않고 저장도 시도하지 않는다
    await expect(promise).rejects.toBeInstanceOf(ApiException);
    await expect(promise).rejects.toMatchObject({ error: ErrorCodes.RATING_FORBIDDEN });
    expect(rating.score).toBe(4);
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
