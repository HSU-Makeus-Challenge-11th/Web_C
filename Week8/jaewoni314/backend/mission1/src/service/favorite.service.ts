import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favorite } from "../entity/favorite.entity.js";
import { Member } from "../entity/member.entity.js";
import { CreateFavoriteDto } from "../dto/create-favorite.dto.js";
import { FavoriteResponseDto } from "../dto/favorite-response.dto.js";
import { FavoriteStatusResponseDto } from "../dto/favorite-status-response.dto.js";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";

// 모든 메서드의 memberId는 토큰에서 꺼낸 요청자예요. 그래서 다른 회원의 즐겨찾기는 조회하거나 해제할 수 없어요.
@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async create(memberId: number, dto: CreateFavoriteDto): Promise<FavoriteResponseDto> {
    // 토큰은 유효해도 그사이 회원이 없어졌을 수 있어서 회원부터 확인해요.
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(ErrorCodes.MEMBER_NOT_FOUND);
    }

    // DB의 UNIQUE 제약도 막아 주지만, FAVORITE409_1이라는 정한 오류로 응답하려고 먼저 확인해요.
    // 동시에 들어온 요청이 이 확인을 함께 통과하면 UNIQUE 제약에서 막히고, 전역 필터가 같은 409로 바꿔요.
    const exists = await this.favoriteRepository.exists({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (exists) {
      throw new ApiException(ErrorCodes.FAVORITE_DUPLICATED);
    }

    const saved = await this.favoriteRepository.save(
      this.favoriteRepository.create({ member, movieId: dto.movieId }),
    );
    return FavoriteResponseDto.from(saved);
  }

  // 내 즐겨찾기만 최근에 등록한 순서(favoriteId 내림차순)로 보여 줘요. 없으면 빈 배열이에요.
  async getMyFavorites(memberId: number): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.find({
      where: { member: { memberId } },
      order: { favoriteId: "DESC" },
    });
    return favorites.map((favorite) => FavoriteResponseDto.from(favorite));
  }

  async getStatus(memberId: number, movieId: number): Promise<FavoriteStatusResponseDto> {
    const isFavorite = await this.favoriteRepository.exists({
      where: { member: { memberId }, movieId },
    });
    return FavoriteStatusResponseDto.from(isFavorite);
  }

  // favoriteId가 아니라 movieId로 해제해요. 화면은 영화 ID만 알고 있기 때문이에요.
  // 내 즐겨찾기 중에서만 찾으므로, 다른 회원의 즐겨찾기는 "없는 즐겨찾기"(404)가 돼요.
  async delete(memberId: number, movieId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { member: { memberId }, movieId },
    });
    if (!favorite) {
      throw new ApiException(ErrorCodes.FAVORITE_NOT_FOUND);
    }

    await this.favoriteRepository.remove(favorite);
  }
}
