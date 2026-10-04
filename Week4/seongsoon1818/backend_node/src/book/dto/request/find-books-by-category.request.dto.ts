import { IsPositiveId } from '../../../common/decorators/is-positive-id.decorator';

export class FindBooksByCategoryRequestDto {
  @IsPositiveId()
  categoryId!: number;
}
