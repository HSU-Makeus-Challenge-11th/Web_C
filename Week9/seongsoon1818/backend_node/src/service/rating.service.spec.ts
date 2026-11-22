import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { RatingService } from './rating.service';

describe('RatingService', () => {
  const ratingRepository = {
    findOne: vi.fn(),
    save: vi.fn(),
  };
  const memberRepository = {
    findOneBy: vi.fn(),
  };
  let ratingService: RatingService;

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();
    ratingService = module.get(RatingService);
  });

  it('같은 영화에 평점을 중복 등록하면 RATING409_1을 반환하고 저장하지 않는다', async () => {
    memberRepository.findOneBy.mockResolvedValue({ memberId: 1 });
    ratingRepository.findOne.mockResolvedValue({ ratingId: 7, movieId: 550 });

    await expect(ratingService.create(1, { movieId: 550, score: 5 })).rejects.toMatchObject({
      code: 'RATING409_1',
      status: HttpStatus.CONFLICT,
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('남의 평점을 수정하려 하면 RATING403_1을 반환하고 저장하지 않는다', async () => {
    ratingRepository.findOne.mockResolvedValue({
      ratingId: 7,
      member: { memberId: 2 },
      movieId: 550,
      score: 5,
      comment: null,
    });

    await expect(ratingService.update(1, 7, { score: 4 })).rejects.toMatchObject({
      code: 'RATING403_1',
      status: HttpStatus.FORBIDDEN,
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
