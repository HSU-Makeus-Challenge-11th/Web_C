import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

function toInteger(value: unknown): number {
  return typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN;
}

export class RatingsQueryDto {
  @Transform(({ value }) => toInteger(value))
  @IsInt({ message: 'page는 0 이상의 정수여야 합니다.' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  page = 0;

  @Transform(({ value }) => toInteger(value))
  @IsInt({ message: 'size는 1~100 사이의 정수여야 합니다.' })
  @Min(1)
  @Max(100)
  size = 10;
}
