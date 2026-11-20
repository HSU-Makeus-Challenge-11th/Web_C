import { FavoriteResponseDto } from "./favorite-response.dto.js";
import { RatingResponseDto } from "./rating-response.dto.js";

// addToFavorites가 false면 즐겨찾기를 만들지 않아서 favorite은 null이에요.
export class MovieRecordResponseDto {
  rating: RatingResponseDto;
  favorite: FavoriteResponseDto | null;

  static of(rating: RatingResponseDto, favorite: FavoriteResponseDto | null): MovieRecordResponseDto {
    return { rating, favorite };
  }
}
