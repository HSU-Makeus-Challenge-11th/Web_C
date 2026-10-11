import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Rental } from '../rental/rental.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  name!: string | null;

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals?: Relation<Rental[]>;
}
