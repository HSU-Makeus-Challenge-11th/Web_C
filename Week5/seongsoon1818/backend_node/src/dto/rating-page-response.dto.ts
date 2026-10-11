import { RatingResponseDto } from './rating-response.dto';

export class RatingPageResponseDto {
  items: RatingResponseDto[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
