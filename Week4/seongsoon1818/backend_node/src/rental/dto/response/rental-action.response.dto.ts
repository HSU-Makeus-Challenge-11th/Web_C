export class RentalActionResponseDto {
  rentalId: number;
  message: string;

  constructor(rentalId: number, message: string) {
    this.rentalId = rentalId;
    this.message = message;
  }
}
