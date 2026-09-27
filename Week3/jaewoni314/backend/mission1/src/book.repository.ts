import { Injectable, Inject } from '@nestjs/common';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

@Injectable() // NestJS 컨테이너에 "나 주입 가능한 부품이야!"라고 등록
export class BookRepository {
  constructor(
    // database.provider에서 등록해둔 DB 커넥션 풀을 가져옵니다.
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  // 실습 1. 도서 전체 목록 조회
  async findAll(): Promise<RowDataPacket[]> {
    const sql = 'SELECT * FROM book';

    // pool.query()는 [조회된 행들, 메타데이터] 형태의 배열을 돌려줍니다.
    const [rows] = await this.pool.query<RowDataPacket[]>(sql);
    return rows;
  }

  // 미션 1. 특정 카테고리의 도서 목록 조회
  async findByCategoryId(categoryId: number): Promise<RowDataPacket[]> {
    const sql = 'SELECT * FROM book WHERE category_id = ? ORDER BY book_id DESC';

    // 값 자리를 ?로 두고 파라미터 바인딩해 SQL Injection을 막습니다.
    const [rows] = await this.pool.execute<RowDataPacket[]>(sql, [categoryId]);
    return rows;
  }

  // 실습 2. 신규 도서 등록
  async create(body: Record<string, any>): Promise<ResultSetHeader> {
    const sql =
      'INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)';

    const [result] = await this.pool.execute<ResultSetHeader>(sql, [
      body.categoryId,
      body.title,
      body.description,
    ]);
    return result;
  }
}
