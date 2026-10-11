import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalRequestDto } from './dto/request/create-rental.request.dto';
import { ReturnRentalRequestDto } from './dto/request/return-rental.request.dto';
import { RentalActionResponseDto } from './dto/response/rental-action.response.dto';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  createRental(@Body() body: CreateRentalRequestDto): Promise<RentalActionResponseDto> {
    return this.rentalService.createRental(body);
  }

  @Patch(':rentalId/return')
  returnRental(@Param() params: ReturnRentalRequestDto): Promise<RentalActionResponseDto> {
    return this.rentalService.returnRental(params.rentalId);
  }
}
