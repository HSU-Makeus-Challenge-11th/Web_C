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
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoginMember } from '../decorator/login-member.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { RatingsQueryDto } from '../dto/ratings-query.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { RatingService } from '../service/rating.service';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('members/:memberId/ratings')
  getMemberRatings(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Query() { page, size }: RatingsQueryDto,
  ) {
    return this.ratingService.getRatingsByMember(memberId, page, size);
  }

  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @LoginMember() memberId: number,
    @Body() dto: CreateRatingDto,
  ) {
    const ratingId = await this.ratingService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result: ratingId,
    };
  }

  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @LoginMember() memberId: number,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const result = await this.ratingService.update(memberId, ratingId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result,
    };
  }

  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @LoginMember() memberId: number,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    await this.ratingService.delete(ratingId, memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}
