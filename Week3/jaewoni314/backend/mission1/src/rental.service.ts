import { Injectable, NotFoundException } from '@nestjs/common';
import { RentalRepository } from './rental.repository.js';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(body: Record<string, any>): Promise<string> {
    await this.rentalRepository.create(body);
    return '도서 대여가 완료되었습니다!';
  }

  async returnRental(rentalId: number): Promise<string> {
    const result = await this.rentalRepository.returnRental(rentalId);

    // 해당 rental_id가 없으면 바뀐 행이 없으므로 404로 알려 줍니다.
    if (result.affectedRows === 0) {
      throw new NotFoundException('해당 대여 기록을 찾을 수 없습니다.');
    }
    return '도서 반납이 완료되었습니다!';
  }
}
