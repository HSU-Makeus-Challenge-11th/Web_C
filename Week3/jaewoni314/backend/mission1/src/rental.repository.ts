import { Injectable, Inject } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

@Injectable()
export class RentalRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  // 미션 2. 신규 대여 기록 생성
  // rented_at은 현재 시간, due_at은 7일 뒤로 DB 함수에서 계산합니다.
  async create(body: Record<string, any>): Promise<ResultSetHeader> {
    const sql =
      'INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at) ' +
      'VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)';

    const [result] = await this.pool.execute<ResultSetHeader>(sql, [
      body.userId,
      body.bookId,
    ]);
    return result;
  }

  // 선택 미션. 도서 반납 처리
  async returnRental(rentalId: number): Promise<ResultSetHeader> {
    const sql = 'UPDATE rental SET returned_at = NOW() WHERE rental_id = ?';

    const [result] = await this.pool.execute<ResultSetHeader>(sql, [rentalId]);
    return result;
  }
}
