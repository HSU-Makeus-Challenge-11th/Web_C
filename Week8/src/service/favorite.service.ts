// src/service/favorite.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from '../dto/create-favorite.dto.js';
import { FavoriteResponseDto } from '../dto/favorite-response.dto.js';
import { FavoriteStatusResponseDto } from '../dto/favorite-status-response.dto.js';
import { Favorite } from '../entity/favorite.entity.js';
import { Member } from '../entity/member.entity.js';
import { ApiException } from '../exception/api.exception.js';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async create(
    memberId: number,
    dto: CreateFavoriteDto,
  ): Promise<FavoriteResponseDto> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '해당 회원을 찾을 수 없습니다.',
      );
    }

    const existing = await this.favoriteRepository.findOne({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (existing) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        'FAVORITE409_1',
        '이미 이 영화를 즐겨찾기하셨습니다.',
      );
    }

    const saved = await this.favoriteRepository.save(
      this.favoriteRepository.create({ member, movieId: dto.movieId }),
    );
    return FavoriteResponseDto.from(saved);
  }

  async getMyFavorites(memberId: number): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.find({
      where: { member: { memberId } },
      order: { favoriteId: 'DESC' },
    });
    return favorites.map(FavoriteResponseDto.from);
  }

  async getStatus(
    memberId: number,
    movieId: number,
  ): Promise<FavoriteStatusResponseDto> {
    const isFavorite = await this.favoriteRepository.exists({
      where: { member: { memberId }, movieId },
    });
    return FavoriteStatusResponseDto.from(isFavorite);
  }

  async delete(memberId: number, movieId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { member: { memberId }, movieId },
    });
    if (!favorite) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'FAVORITE404_1',
        '즐겨찾기한 영화를 찾을 수 없습니다.',
      );
    }

    await this.favoriteRepository.remove(favorite);
  }
}
