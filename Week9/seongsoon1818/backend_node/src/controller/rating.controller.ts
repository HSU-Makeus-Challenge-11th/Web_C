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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('평점')
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({ summary: '유저별 평점 조회', description: '회원의 평점을 페이지별로 조회합니다. 토큰 없이 호출할 수 있습니다.' })
  @Get('members/:memberId/ratings')
  getMemberRatings(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Query() { page, size }: RatingsQueryDto,
  ) {
    return this.ratingService.getRatingsByMember(memberId, page, size);
  }

  @ApiOperation({ summary: '평점 등록', description: '로그인한 회원이 영화에 평점과 후기를 등록합니다. Bearer 토큰이 필요합니다.' })
  @ApiBearerAuth('bearerAuth')
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

  @ApiOperation({ summary: '평점 수정', description: '본인이 작성한 평점과 후기를 수정합니다. Bearer 토큰이 필요합니다.' })
  @ApiBearerAuth('bearerAuth')
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

  @ApiOperation({ summary: '평점 삭제', description: '본인이 작성한 평점을 삭제합니다. Bearer 토큰이 필요합니다.' })
  @ApiBearerAuth('bearerAuth')
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
