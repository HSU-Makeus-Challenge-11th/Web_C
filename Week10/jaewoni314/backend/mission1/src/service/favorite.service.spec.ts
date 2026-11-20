import { Test, type TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";
import { Favorite } from "../entity/favorite.entity.js";
import { Member } from "../entity/member.entity.js";
import { FavoriteService } from "./favorite.service.js";

// [실습 4] DB 없이 FavoriteService의 판단(중복이면 막는다)만 확인하는 단위 테스트예요.
// Repository 자리에는 "호출을 기억하는 빈 함수"(vi.fn())로 만든 가짜를 끼워 넣어요.
describe("FavoriteService (단위 테스트)", () => {
  let favoriteService: FavoriteService;

  // 서비스가 실제로 부르는 메서드만 가짜로 만들어요.
  const favoriteRepository = {
    exists: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
  const memberRepository = {
    findOneBy: vi.fn(),
  };

  const member = { memberId: 1, nickname: "영화조아" } as Member;

  beforeEach(async () => {
    vi.clearAllMocks(); // 앞 테스트에서 기억한 호출 기록과 반환값을 지워요.

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        // "Favorite Repository를 달라고 하면 위의 가짜를 주세요"라는 뜻이에요.
        { provide: getRepositoryToken(Favorite), useValue: favoriteRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    favoriteService = module.get(FavoriteService);
  });

  it("아직 즐겨찾기하지 않은 영화면 즐겨찾기를 저장한다", async () => {
    // given: 회원은 존재하고, 아직 이 영화를 즐겨찾기하지 않은 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    favoriteRepository.exists.mockResolvedValue(false);
    favoriteRepository.create.mockReturnValue({ member, movieId: 550 });
    favoriteRepository.save.mockResolvedValue({
      favoriteId: 1,
      movieId: 550,
      createdAt: new Date("2026-11-20T21:00:00.000Z"),
    });

    // when: 즐겨찾기를 등록하면
    const response = await favoriteService.create(1, { movieId: 550 });

    // then: 저장된 영화 ID가 응답에 담기고, 저장이 실제로 한 번 호출된다
    expect(response.movieId).toBe(550);
    expect(favoriteRepository.save).toHaveBeenCalledTimes(1);
  });

  it("이미 즐겨찾기한 영화면 FAVORITE409_1 예외를 던지고 저장하지 않는다", async () => {
    // given: 같은 회원이 같은 영화를 이미 즐겨찾기해 둔 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    favoriteRepository.exists.mockResolvedValue(true);

    // when & then: FAVORITE409_1 예외가 나고, 저장은 시도조차 하지 않는다
    const promise = favoriteService.create(1, { movieId: 550 });
    await expect(promise).rejects.toBeInstanceOf(ApiException);
    await expect(promise).rejects.toMatchObject({ error: ErrorCodes.FAVORITE_DUPLICATED });
    expect(favoriteRepository.save).not.toHaveBeenCalled();
  });
});
