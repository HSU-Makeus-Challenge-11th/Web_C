import { IsPositiveId } from '../../../common/decorators/is-positive-id.decorator';

export class CreateRentalRequestDto {
  @IsPositiveId()
  userId!: number;

  @IsPositiveId()
  bookId!: number;
}
