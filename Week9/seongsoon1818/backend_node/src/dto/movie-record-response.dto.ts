import { FavoriteResponseDto } from './favorite-response.dto';
import { RatingResponseDto } from './rating-response.dto';

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