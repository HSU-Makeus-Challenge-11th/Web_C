import { Favorite } from "../entity/favorite.entity.js";

export class FavoriteResponseDto {
  favoriteId: number;
  movieId: number;
  createdAt: Date;

  static from(favorite: Favorite): FavoriteResponseDto {
    return {
      favoriteId: favorite.favoriteId,
      movieId: favorite.movieId,
      createdAt: favorite.createdAt,
    };
  }
}
