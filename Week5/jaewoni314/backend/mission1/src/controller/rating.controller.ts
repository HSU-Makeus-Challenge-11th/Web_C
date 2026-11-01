import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { RatingService } from "../service/rating.service.js";

@Controller("members")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(":memberId/ratings")
  getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }
}
