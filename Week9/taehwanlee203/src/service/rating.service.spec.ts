import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import { ApiException } from '../exception/api.exception.js';
import { RatingService } from './rating.service.js';

describe('RatingService', () => {
  let ratingService: RatingService;

  const ratingRepository = {
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const memberRepository = {
    findOneBy: vi.fn(),
  };

  const member = { memberId: 1, nickname: '영화조아' } as Member;
  const otherMember = { memberId: 2, nickname: '다른유저' } as Member;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    ratingService = module.get<RatingService>(RatingService);
  });

  it('같은 영화에 평점을 중복 등록하면 RATING409_1 예외를 던지고 저장하지 않는다', async () => {
    // given: 회원이 존재하고, 이미 영화 550번에 평점을 남긴 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    ratingRepository.findOne.mockResolvedValue({
      ratingId: 1,
      member,
      movieId: 550,
      score: 5,
    });

    // when & then: RATING409_1 예외가 발생하고 저장은 호출되지 않는다
    await expect(
      ratingService.create(1, { movieId: 550, score: 4, comment: '중복 등록' }),
    ).rejects.toMatchObject({
      code: 'RATING409_1',
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('남의 평점을 수정하려 하면 RATING403_1 예외를 던지고 저장하지 않는다', async () => {
    // given: ratingId가 10번인 평점의 작성자가 2번 회원(otherMember)인 상황
    ratingRepository.findOne.mockResolvedValue({
      ratingId: 10,
      member: otherMember,
      movieId: 550,
      score: 5,
      comment: '원래 후기',
    });

    // when & then: 1번 회원이 수정을 시도하면 RATING403_1 예외가 발생하고 저장되지 않는다
    await expect(
      ratingService.update(1, 10, { score: 1, comment: '남의 평점 수정 시도' }),
    ).rejects.toMatchObject({
      code: 'RATING403_1',
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
