// src/dto/movie-record-response.dto.ts
import { FavoriteResponseDto } from './favorite-response.dto.js';
import { RatingResponseDto } from './rating-response.dto.js';

export class MovieRecordResponseDto {
  rating: RatingResponseDto;
  favorite: FavoriteResponseDto | null;

  static of(
    rating: RatingResponseDto,
    favorite: FavoriteResponseDto | null,
  ): MovieRecordResponseDto {
    return { rating, favorite };
  }
}
