import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RentalRepository } from './rental.repository';
import type { CreateRentalRequestDto } from './dto/request/create-rental.request.dto';
import { RentalActionResponseDto } from './dto/response/rental-action.response.dto';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(body: CreateRentalRequestDto): Promise<RentalActionResponseDto> {
    try {
      const rentalId = await this.rentalRepository.create(body.userId, body.bookId);
      return new RentalActionResponseDto(rentalId, '도서 대여가 완료되었습니다!');
    } catch (error) {
      if (error instanceof Error && 'code' in error
        && error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestException('등록된 userId와 bookId인지 확인해주세요.');
      }
      throw error;
    }
  }

  async returnRental(rentalId: number): Promise<RentalActionResponseDto> {
    const affectedRows = await this.rentalRepository.returnRental(rentalId);
    if (affectedRows === 0) {
      throw new NotFoundException('대여 기록을 찾을 수 없습니다.');
    }
    return new RentalActionResponseDto(rentalId, '도서 반납이 완료되었습니다!');
  }
}
