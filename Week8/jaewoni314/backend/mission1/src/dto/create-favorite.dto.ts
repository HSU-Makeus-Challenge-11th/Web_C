import { IsInt, IsNotEmpty, Min } from "class-validator";

// 누구의 즐겨찾기인지는 토큰에서 알아내므로 바디에는 movieId만 받아요. (memberId를 보내면 400)
// 여러 규칙이 함께 실패하면 아래쪽 데코레이터의 메시지가 먼저 나와서, 입력 여부와 정수인지 보는 기본 검사를 아래에 둬요.
export class CreateFavoriteDto {
  @Min(1, { message: "영화 ID는 양수여야 합니다." })
  @IsInt({ message: "영화 ID는 정수여야 합니다." })
  @IsNotEmpty({ message: "영화 ID는 필수입니다." })
  movieId: number;
}
