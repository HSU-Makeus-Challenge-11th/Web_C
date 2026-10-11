import type { Book } from '../../book.entity';

export class BookResponseDto {
  id: number;
  title: string;
  categoryName: string | null;
  isAvailable: boolean;

  constructor(book: Pick<Book, 'id' | 'title'> & {
    categoryName: string | null;
    isAvailable: number | boolean;
  }) {
    this.id = book.id;
    this.title = book.title;
    this.categoryName = book.categoryName;
    this.isAvailable = book.isAvailable === 1 || book.isAvailable === true;
  }
}
