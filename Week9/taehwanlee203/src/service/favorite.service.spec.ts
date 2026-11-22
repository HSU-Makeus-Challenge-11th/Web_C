// src/service/favorite.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { vi } from 'vitest';
import { ApiException } from '../exception/api.exception.js';
import { Favorite } from '../entity/favorite.entity.js';
import { Member } from '../entity/member.entity.js';
import { FavoriteService } from './favorite.service.js';

describe('FavoriteService', () => {
  let favoriteService: FavoriteService;

  // Vitest에서는 jest.fn() 대신 vi.fn()을 사용합니다.
  const favoriteRepository = {
    findOne: vi.fn(),
    save: vi.fn(),
    create: vi.fn(),
  };
  const memberRepository = {
    findOneBy: vi.fn(),
  };

  const member = { memberId: 1, nickname: '영화조아' } as Member;

  beforeEach(async () => {
    vi.clearAllMocks(); // 앞 테스트에서 기억한 호출 기록을 지웁니다

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        { provide: getRepositoryToken(Favorite), useValue: favoriteRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    favoriteService = module.get<FavoriteService>(FavoriteService);
  });

  it('아직 즐겨찾기하지 않은 영화면 즐겨찾기를 저장한다', async () => {
    // given: 회원은 존재하고, 아직 이 영화를 즐겨찾기하지 않은 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    favoriteRepository.findOne.mockResolvedValue(null);
    favoriteRepository.create.mockReturnValue({ member, movieId: 550 });
    favoriteRepository.save.mockResolvedValue({
      favoriteId: 1,
      movieId: 550,
      createdAt: new Date('2026-09-13T21:00:00.000Z'),
    });

    // when: 즐겨찾기를 등록하면
    const response = await favoriteService.create(1, { movieId: 550 });

    // then: 저장된 영화 ID가 응답에 담기고, 저장이 실제로 호출된다
    expect(response.movieId).toBe(550);
    expect(favoriteRepository.save).toHaveBeenCalledTimes(1);
  });

  it('이미 즐겨찾기한 영화면 FAVORITE409_1 예외를 던지고 저장하지 않는다', async () => {
    // given: 같은 회원이 같은 영화를 이미 즐겨찾기해 둔 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    favoriteRepository.findOne.mockResolvedValue({
      favoriteId: 1,
      movieId: 550,
    });

    // when & then: 예외가 나고, 저장은 시도조차 하지 않는다
    await expect(favoriteService.create(1, { movieId: 550 })).rejects.toThrow(
      ApiException,
    );
    expect(favoriteRepository.save).not.toHaveBeenCalled();
  });
});
