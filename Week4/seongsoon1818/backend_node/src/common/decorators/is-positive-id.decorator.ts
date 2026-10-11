import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

// 현재 DB의 signed INT 범위에 맞추고, 숫자로만 된 문자열도 허용합니다.
export function IsPositiveId() {
  return applyDecorators(
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value,
    ),
    IsInt(),
    Min(1),
    Max(2147483647),
  );
}
