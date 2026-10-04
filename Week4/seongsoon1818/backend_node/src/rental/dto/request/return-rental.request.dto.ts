import { IsPositiveId } from '../../../common/decorators/is-positive-id.decorator';

// 반납 요청은 본문 없이 경로의 rentalId만 받습니다.
export class ReturnRentalRequestDto {
  @IsPositiveId()
  rentalId!: number;
}
