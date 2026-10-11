import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Book } from './book.entity';

type BookRecord = Pick<Book, 'id' | 'title'> & {
  categoryName: string | null;
  isAvailable: boolean;
};
type BookListRow = Pick<BookRecord, 'id' | 'title' | 'categoryName'> & {
  activeRentalCount: string | number;
};
type CreateBookData = Pick<Book, 'title' | 'auth'> & { categoryId: number };

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(Book) private readonly books: Repository<Book>,
  ) {}

  findAll(): Promise<BookRecord[]> {
    return this.getBookRecords(this.createListQuery());
  }

  findByCategory(categoryId: number): Promise<BookRecord[]> {
    const query = this.createListQuery().where({ category_id: categoryId });
    return this.getBookRecords(query);
  }

  async create(book: CreateBookData): Promise<number> {
    const entity = this.books.create({
      title: book.title,
      auth: book.auth,
      category_id: book.categoryId,
    });
    const saved = await this.books.save(entity);
    return saved.id;
  }

  private createListQuery(): SelectQueryBuilder<Book> {
    // 엔티티의 관계로 JOIN을 구성하고 미반납 건수만 집계합니다.
    return this.books.createQueryBuilder('book')
      .leftJoin('book.category', 'category')
      .leftJoin('book.rentals', 'activeRental', 'activeRental.returned_at IS NULL')
      .select('book.id', 'id')
      .addSelect('book.title', 'title')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(activeRental.id)', 'activeRentalCount')
      .groupBy('book.id')
      .addGroupBy('book.title')
      .addGroupBy('category.name')
      .orderBy('book.id', 'DESC');
  }

  private async getBookRecords(query: SelectQueryBuilder<Book>): Promise<BookRecord[]> {
    const rows = await query.getRawMany<BookListRow>();
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      categoryName: row.categoryName,
      isAvailable: Number(row.activeRentalCount) === 0,
    }));
  }
}
