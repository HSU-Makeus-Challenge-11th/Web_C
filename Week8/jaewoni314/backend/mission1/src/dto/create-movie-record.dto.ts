import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

// 평점과 즐겨찾기를 한 번에 저장하는 "영화 기록" 요청이에요. memberId는 토큰에서 알아내요.
// 여러 규칙이 함께 실패하면 아래쪽 데코레이터의 메시지가 먼저 나와서, 입력 여부와 타입을 보는 기본 검사를 아래에 둬요.
export class CreateMovieRecordDto {
  @ApiProperty({ description: "TMDB 영화 ID (1 이상의 정수, 필수)", example: 238, minimum: 1 })
  @Min(1, { message: "영화 ID는 양수여야 합니다." })
  @IsInt({ message: "영화 ID는 정수여야 합니다." })
  @IsNotEmpty({ message: "영화 ID는 필수입니다." })
  movieId: number;

  @ApiProperty({ description: "별점 (1~5 정수, 필수)", example: 5, minimum: 1, maximum: 5 })
  @Max(5, { message: "별점은 5점 이하여야 합니다." })
  @Min(1, { message: "별점은 1점 이상이어야 합니다." })
  @IsInt({ message: "별점은 정수여야 합니다." })
  @IsNotEmpty({ message: "별점은 필수입니다." })
  score: number;

  // 워크북 참조 구현은 길이 제한이 없지만, 같은 rating 행을 만드는 평점 등록 API(500자)와 규칙을 맞췄어요.
  // 제한이 다르면 평점 등록에서 막힌 긴 후기를 이 API로는 저장할 수 있게 돼요.
  @ApiPropertyOptional({ description: "후기 (선택, 500자 이하)", example: "다시 보고 싶은 영화입니다.", maxLength: 500 })
  @IsOptional()
  @MaxLength(500, { message: "후기는 500자 이하로 입력해주세요." })
  @IsString({ message: "후기는 문자열이어야 합니다." })
  comment?: string;

  // 필수예요. 빠지거나 true/false가 아니면 400이에요.
  @ApiProperty({ description: "true면 즐겨찾기도 같은 트랜잭션으로 저장해요. (필수)", example: true })
  @IsBoolean({ message: "즐겨찾기 추가 여부는 true 또는 false여야 합니다." })
  addToFavorites: boolean;
}
