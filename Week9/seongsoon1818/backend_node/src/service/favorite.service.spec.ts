import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiException } from '../exception/api.exception';
import { Favorite } from '../entity/favorite.entity';
import { Member } from '../entity/member.entity';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let favoriteService: FavoriteService;

  // 진짜 DB 대신 들어갈 가짜 Repository입니다. vi.fn()은 "호출을 기억하는 빈 함수"예요.
  const favoriteRepository = {
    existsBy: vi.fn(),
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
        // "Favorite Repository를 달라고 하면 위의 가짜를 주세요"라는 뜻입니다
        { provide: getRepositoryToken(Favorite), useValue: favoriteRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    favoriteService = module.get<FavoriteService>(FavoriteService);
  });

  it('아직 즐겨찾기하지 않은 영화면 즐겨찾기를 저장한다', async () => {
    // given: 회원은 존재하고, 아직 이 영화를 즐겨찾기하지 않은 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    favoriteRepository.existsBy.mockResolvedValue(false);
    favoriteRepository.create.mockReturnValue({ member, movieId: 550 });
    favoriteRepository.save.mockResolvedValue({
      favoriteId: 1,
      movieId: 550,
      createdAt: new Date('2026-09-13T21:00:00.000Z'),
    });

    // when: 즐겨찾기를 등록하면
    const response = await favoriteService.create(1, 550);

    // then: 저장된 영화 ID가 응답에 담기고, 저장이 실제로 호출된다
    expect(response.movieId).toBe(550);
    expect(favoriteRepository.save).toHaveBeenCalledTimes(1);
  });
  
  it('이미 즐겨찾기한 영화면 FAVORITE409_1 예외를 던지고 저장하지 않는다', async () => {
    // given: 같은 회원이 같은 영화를 이미 즐겨찾기해 둔 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    favoriteRepository.existsBy.mockResolvedValue(true);

    // when & then: 예외가 나고, 저장은 시도조차 하지 않는다
    await expect(favoriteService.create(1, 550)).rejects.toThrow(
      ApiException,
    );
    expect(favoriteRepository.save).not.toHaveBeenCalled();
  });
});
