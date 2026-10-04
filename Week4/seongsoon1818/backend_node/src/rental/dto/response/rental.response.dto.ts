import type { Rental } from '../../rental.entity';

export class RentalResponseDto {
  id: number;
  user_id: number;
  book_id: number;
  rented_at: string;
  due_at: string;
  returned_at: string | null;

  constructor(rental: Pick<Rental, 'id' | 'user_id' | 'book_id' | 'rented_at' | 'due_at' | 'returned_at'>) {
    this.id = rental.id;
    this.user_id = rental.user_id;
    this.book_id = rental.book_id;
    this.rented_at = rental.rented_at.toISOString();
    this.due_at = rental.due_at.toISOString();
    this.returned_at = rental.returned_at?.toISOString() ?? null;
  }
}
