import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RentalRepository } from './rental.repository';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(userId: number, bookId: number) {
    try {
      const rentalId = await this.rentalRepository.create(userId, bookId);
      return { rentalId, message: '도서 대여가 완료되었습니다!' };
    } catch (error) {
      if (error instanceof Error && 'code' in error
        && error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestException('등록된 userId와 bookId인지 확인해주세요.');
      }
      throw error;
    }
  }

  async returnRental(rentalId: number) {
    const affectedRows = await this.rentalRepository.returnRental(rentalId);
    if (affectedRows === 0) {
      throw new NotFoundException('대여 기록을 찾을 수 없습니다.');
    }
    return { rentalId, message: '도서 반납이 완료되었습니다!' };
  }
}
