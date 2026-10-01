import { Inject, Injectable } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider';

@Injectable()
export class RentalRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  async create(userId: number, bookId: number): Promise<number> {
    const sql = `
      INSERT INTO rental (user_id, book_id, rented_at, due_at)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;
    const [result] = await this.pool.execute<ResultSetHeader>(sql, [userId, bookId]);
    return result.insertId;
  }

  async returnRental(rentalId: number): Promise<number> {
    // 현재 연결된 DB의 대여 기본 키는 rental_id가 아닌 id입니다.
    const sql = 'UPDATE rental SET returned_at = NOW() WHERE id = ?';
    const [result] = await this.pool.execute<ResultSetHeader>(sql, [rentalId]);
    return result.affectedRows;
  }
}
