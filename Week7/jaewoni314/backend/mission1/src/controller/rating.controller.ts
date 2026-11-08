import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { RatingService } from "../service/rating.service.js";
import { CreateRatingDto } from "../dto/create-rating.dto.js";
import { UpdateRatingDto } from "../dto/update-rating.dto.js";
import { ApiResponse } from "../common/api-response.js";

// 아직 로그인 전이라 어느 회원의 요청인지 경로의 memberId로 구분해요.
@Controller("members")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(":memberId/ratings")
  getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Post(":memberId/ratings")
  @HttpCode(HttpStatus.CREATED)
  async create(@Param("memberId", ParseIntPipe) memberId: number, @Body() dto: CreateRatingDto) {
    const ratingId = await this.ratingService.create(memberId, dto);
    return ApiResponse.success("COMMON201", "평점 등록에 성공했습니다.", ratingId);
  }

  @Patch(":memberId/ratings/:ratingId")
  async update(
    @Param("memberId", ParseIntPipe) memberId: number,
    @Param("ratingId", ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    await this.ratingService.update(ratingId, memberId, dto);
    return ApiResponse.success("COMMON200", "평점 수정에 성공했습니다.", null);
  }

  @Delete(":memberId/ratings/:ratingId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param("memberId", ParseIntPipe) memberId: number,
    @Param("ratingId", ParseIntPipe) ratingId: number,
  ) {
    await this.ratingService.delete(ratingId, memberId);
  }
}
