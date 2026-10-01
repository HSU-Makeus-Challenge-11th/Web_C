import { BadRequestException, Injectable } from '@nestjs/common';
import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform<unknown, number> {
  transform(value: unknown, metadata: ArgumentMetadata): number {
    const parsed = typeof value === 'number'
      ? value
      : typeof value === 'string' && /^\d+$/.test(value)
        ? Number(value)
        : NaN;

    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(
        `${metadata.data ?? 'ID'}는 양의 정수로 입력해주세요.`,
      );
    }

    return parsed;
  }
}
