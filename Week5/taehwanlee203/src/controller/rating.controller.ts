// src/controller/rating.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RatingService } from '../service/rating.service.js';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Get('ratings')
  getAllRatings() {
    return this.ratingService.getAllRatings();
  }
}
