// src/dto/update-rating.dto.ts
import { IsInt, IsOptional, Max, MaxLength, Min } from 'class-validator';

export class UpdateRatingDto {
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '별점은 5점 이하여야 합니다.' })
  score: number;

  @IsOptional()
  @MaxLength(500, { message: '후기는 500자 이하로 입력해주세요.' })
  comment?: string;
}
