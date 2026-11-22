export class FavoriteStatusResponseDto {
  isFavorite: boolean;

  static from(isFavorite: boolean): FavoriteStatusResponseDto {
    return { isFavorite };
  }
}