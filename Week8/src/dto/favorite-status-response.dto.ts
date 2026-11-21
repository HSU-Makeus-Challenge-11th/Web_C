// src/dto/favorite-status-response.dto.ts
export class FavoriteStatusResponseDto {
  isFavorite: boolean;

  static from(isFavorite: boolean): FavoriteStatusResponseDto {
    return { isFavorite };
  }
}
