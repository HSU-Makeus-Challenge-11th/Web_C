import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './rental.entity';

@Injectable()
export class RentalRepository {
  constructor(
    @InjectRepository(Rental) private readonly rentals: Repository<Rental>,
  ) {}

  async create(userId: number, bookId: number): Promise<number> {
    // DB 서버 시간으로 대여 시각과 7일 뒤 기한을 계산하는 기존 동작을 유지합니다.
    const result = await this.rentals.insert({
      user_id: userId,
      book_id: bookId,
      rented_at: () => 'CURRENT_TIMESTAMP',
      due_at: () => 'DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY)',
      returned_at: null,
    });
    return result.identifiers[0].id as number;
  }

  async returnRental(rentalId: number): Promise<number> {
    const result = await this.rentals.update(
      { id: rentalId },
      { returned_at: () => 'CURRENT_TIMESTAMP' },
    );
    return result.affected ?? 0;
  }
}
