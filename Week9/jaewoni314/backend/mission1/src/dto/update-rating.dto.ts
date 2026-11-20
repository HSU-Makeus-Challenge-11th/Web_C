import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

// 수정은 별점과 후기를 함께 보내요. 후기를 빼고 보내면 후기를 지운 것으로 처리해요.
// 여러 규칙이 함께 실패하면 아래쪽 데코레이터의 메시지가 먼저 나와서, 정수인지와 문자열인지 보는 기본 검사를 아래에 둬요.
export class UpdateRatingDto {
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
