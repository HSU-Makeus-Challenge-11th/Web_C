import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Book } from '../book/book.entity';
import { User } from '../user/user.entity';

@Entity('rental')
export class Rental {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({ type: 'int' })
  book_id!: number;

  @Column({ type: 'datetime' })
  rented_at!: Date;

  @Column({ type: 'datetime' })
  due_at!: Date;

  @Column({ type: 'datetime', nullable: true })
  returned_at!: Date | null;

  @ManyToOne(() => User, (user) => user.rentals, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_user_id',
  })
  user?: Relation<User>;

  @ManyToOne(() => Book, (book) => book.rentals, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'book_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_book_id',
  })
  book?: Relation<Book>;
}
