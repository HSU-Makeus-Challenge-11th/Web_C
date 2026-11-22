// 영화 상세 화면에서 "이 영화가 내 즐겨찾기인지"만 알려 줘요.
// 즐겨찾기하지 않은 것도 정상 상태라 404가 아니라 isFavorite: false로 응답해요.
export class FavoriteStatusResponseDto {
  isFavorite: boolean;

  static from(isFavorite: boolean): FavoriteStatusResponseDto {
    return { isFavorite };
  }
}
