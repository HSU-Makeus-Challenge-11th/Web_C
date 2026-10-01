import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { PositiveIntPipe } from './positive-int.pipe';
import { RentalService } from './rental.service';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  createRental(
    @Body('userId', PositiveIntPipe) userId: number,
    @Body('bookId', PositiveIntPipe) bookId: number,
  ) {
    return this.rentalService.createRental(userId, bookId);
  }

  @Patch(':rentalId/return')
  returnRental(@Param('rentalId', PositiveIntPipe) rentalId: number) {
    return this.rentalService.returnRental(rentalId);
  }
}
