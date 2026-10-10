import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { RatingService } from "../service/rating.service";
import { RatingsQueryDto } from "../dto/ratings-query.dto";

@Controller("members")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(":memberId/ratings")
  getMemberRatings(
    @Param("memberId", ParseIntPipe) memberId: number,
    @Query() { page, size }: RatingsQueryDto,
  ) {
    return this.ratingService.getRatingsByMember(memberId, page, size);
  }
}
