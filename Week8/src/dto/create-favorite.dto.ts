// src/dto/create-favorite.dto.ts
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateFavoriteDto {
  @IsNotEmpty({ message: '영화 ID는 필수입니다.' })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @IsPositive({ message: '영화 ID는 양수여야 합니다.' })
  movieId: number;
}
