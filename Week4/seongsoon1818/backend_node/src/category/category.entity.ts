import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 64 })
  name!: string;

  @OneToMany(() => Book, (book) => book.category)
  books?: Relation<Book[]>;
}
