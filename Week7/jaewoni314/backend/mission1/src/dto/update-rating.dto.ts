import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

// 수정은 별점과 후기를 함께 보내요. 후기를 빼고 보내면 후기를 지운 것으로 처리해요.
export class UpdateRatingDto {
  @IsInt({ message: "별점은 정수여야 합니다." })
  @Min(1, { message: "별점은 1점 이상이어야 합니다." })
  @Max(5, { message: "별점은 5점 이하여야 합니다." })
  score: number;

  @IsOptional()
  @IsString({ message: "후기는 문자열이어야 합니다." })
  @MaxLength(500, { message: "후기는 500자 이하로 입력해주세요." })
  comment?: string;
}
