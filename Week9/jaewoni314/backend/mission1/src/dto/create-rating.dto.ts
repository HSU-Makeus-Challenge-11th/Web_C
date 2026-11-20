import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

// 여러 규칙이 함께 실패하면 아래쪽 데코레이터의 메시지가 먼저 나와서, 정수인지와 문자열인지 보는 기본 검사를 아래에 둬요.
export class CreateRatingDto {
  // TMDB가 부여한 영화 ID라서 우리 DB의 movie 테이블을 참조하지 않아요.
  @ApiProperty({ description: "TMDB 영화 ID (1 이상의 정수, 필수)", example: 550, minimum: 1 })
  @Min(1, { message: "영화 ID는 양수여야 합니다." })
  @IsInt({ message: "영화 ID는 정수여야 합니다." })
  movieId: number;

  @ApiProperty({ description: "별점 (1~5 정수, 필수)", example: 5, minimum: 1, maximum: 5 })
  @Max(5, { message: "별점은 5점 이하여야 합니다." })
  @Min(1, { message: "별점은 1점 이상이어야 합니다." })
  @IsInt({ message: "별점은 정수여야 합니다." })
  score: number;

  @ApiPropertyOptional({ description: "후기 (선택, 500자 이하)", example: "인생 영화예요.", maxLength: 500 })
  @IsOptional()
  @MaxLength(500, { message: "후기는 500자 이하로 입력해주세요." })
  @IsString({ message: "후기는 문자열이어야 합니다." })
  comment?: string;
}
