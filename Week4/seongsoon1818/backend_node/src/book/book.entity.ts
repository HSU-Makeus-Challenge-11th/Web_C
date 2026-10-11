import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Category } from '../category/category.entity';
import { Rental } from '../rental/rental.entity';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 64 })
  title!: string;

  @Column({ type: 'varchar', length: 64 })
  auth!: string;

  @Column({ type: 'int', nullable: true })
  category_id!: number | null;

  @ManyToOne(() => Category, (category) => category.books, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'category_id_fk',
  })
  category?: Relation<Category> | null;

  @OneToMany(() => Rental, (rental) => rental.book)
  rentals?: Relation<Rental[]>;
}
