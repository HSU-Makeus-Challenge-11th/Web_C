import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Favorite } from "../entity/favorite.entity.js";
import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";
import { CreateMovieRecordDto } from "../dto/create-movie-record.dto.js";
import { FavoriteResponseDto } from "../dto/favorite-response.dto.js";
import { MovieRecordResponseDto } from "../dto/movie-record-response.dto.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";

@Injectable()
export class MovieRecordService {
  constructor(private readonly dataSource: DataSource) {}

  // 평점과 즐겨찾기를 한 트랜잭션으로 저장해요.
  // 평점만 저장되고 즐겨찾기가 실패하면 사용자가 의도한 "평점 + 즐겨찾기" 기록과 달라지므로, 하나라도 실패하면 둘 다 되돌려요(rollback).
  // 콜백이 끝까지 성공하면 commit, 콜백 안에서 오류가 던져지면 TypeORM이 rollback한 뒤 그 오류를 다시 던져요.
  async create(memberId: number, dto: CreateMovieRecordDto): Promise<MovieRecordResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // 콜백 안에서는 manager가 만든 Repository만 써요.
      // 주입받은 Repository를 섞어 쓰면 다른 DB 연결로 실행돼서 이 트랜잭션에 묶이지 않아요.
      const memberRepository = manager.getRepository(Member);
      const ratingRepository = manager.getRepository(Rating);
      const favoriteRepository = manager.getRepository(Favorite);

      const member = await memberRepository.findOneBy({ memberId });
      if (!member) {
        throw new ApiException(ErrorCodes.MEMBER_NOT_FOUND);
      }

      const ratingExists = await ratingRepository.exists({
        where: { member: { memberId }, movieId: dto.movieId },
      });
      if (ratingExists) {
        throw new ApiException(ErrorCodes.RATING_DUPLICATED);
      }

      // 이미 즐겨찾기한 영화라면 평점을 저장하기 전에 막아요.
      // 미리 확인하지 않아도 아래 favorite 저장이 UNIQUE 제약에서 실패해 평점까지 rollback되지만, 쓸데없는 INSERT를 줄여요.
      if (dto.addToFavorites) {
        const favoriteExists = await favoriteRepository.exists({
          where: { member: { memberId }, movieId: dto.movieId },
        });
        if (favoriteExists) {
          throw new ApiException(ErrorCodes.FAVORITE_DUPLICATED);
        }
      }

      const savedRating = await ratingRepository.save(
        ratingRepository.create({
          member,
          movieId: dto.movieId,
          score: dto.score,
          comment: dto.comment ?? null,
        }),
      );

      let favorite: FavoriteResponseDto | null = null;
      if (dto.addToFavorites) {
        const savedFavorite = await favoriteRepository.save(
          favoriteRepository.create({ member, movieId: dto.movieId }),
        );
        favorite = FavoriteResponseDto.from(savedFavorite);
      }

      return MovieRecordResponseDto.of(RatingResponseDto.from(savedRating), favorite);
    });
  }
}
