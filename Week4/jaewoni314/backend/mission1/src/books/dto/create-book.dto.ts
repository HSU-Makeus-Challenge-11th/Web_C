import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  // 자동 숫자 변환(@Type)을 쓰면 true가 1로 바뀌어 통과해요. JSON 숫자만 받아요.
  @IsInt()
  categoryId: number;

  // 앞뒤 공백을 지운 뒤 검증해서 '   ' 같은 공백 제목을 막아요.
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
