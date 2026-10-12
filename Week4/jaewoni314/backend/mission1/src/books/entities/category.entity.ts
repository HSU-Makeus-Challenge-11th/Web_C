import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity.js';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @Column({ length: 50 })
  name: string;

  // 카테고리 하나에 여러 도서가 속해요 (category 1 : N book)
  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
