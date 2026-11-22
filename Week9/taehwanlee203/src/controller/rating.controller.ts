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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RatingService } from '../service/rating.service.js';
import { CreateRatingDto } from '../dto/create-rating.dto.js';
import { UpdateRatingDto } from '../dto/update-rating.dto.js';
import { AuthGuard, type AuthenticatedRequest } from '../guard/auth.guard.js';

@ApiTags('평점')
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({
    summary: '유저별 평점 목록 조회',
    description:
      '특정 회원이 작성한 평점 목록을 최신순으로 조회합니다. 토큰 없이 호출 가능한 공개 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '유저별 평점 목록 조회 성공',
    schema: {
      example: [
        {
          ratingId: 1,
          movieId: 550,
          score: 5,
          comment: '인생 영화입니다.',
          createdAt: '2026-09-13T21:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 회원',
    schema: {
      example: {
        isSuccess: false,
        code: 'MEMBER404_1',
        message: '해당 회원을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @ApiOperation({
    summary: '평점 등록',
    description:
      '로그인한 회원이 특정 영화에 별점(1~5점)과 한줄평을 등록합니다. (인증 토큰 필요)',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 201,
    description: '평점 등록 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON201',
        message: '평점을 등록했습니다.',
        result: {
          ratingId: 1,
          movieId: 550,
          score: 5,
          comment: '인생 영화입니다.',
          createdAt: '2026-09-13T21:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '이미 평점을 등록한 영화',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING409_1',
        message: '이미 이 영화에 평점을 남기셨습니다.',
        result: null,
      },
    },
  })
  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateRatingDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '평점 수정',
    description:
      '본인이 작성한 평점의 별점과 한줄평을 수정합니다. (인증 토큰 필요)',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 200,
    description: '평점 수정 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '평점을 수정했습니다.',
        result: {
          ratingId: 1,
          movieId: 550,
          score: 4,
          comment: '다시 보니 여운이 더 깊네요.',
          createdAt: '2026-09-13T21:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '본인이 작성하지 않은 평점 수정 시도',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING403_1',
        message: '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 평점',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING404_1',
        message: '해당 평점을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request: AuthenticatedRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.update(memberId, ratingId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '평점 삭제',
    description: '본인이 작성한 평점을 삭제합니다. (인증 토큰 필요)',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 200,
    description: '평점 삭제 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '평점을 삭제했습니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '본인이 작성하지 않은 평점 삭제 시도',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING403_1',
        message: '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 평점',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING404_1',
        message: '해당 평점을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    const memberId = request['memberId'] as number;

    await this.ratingService.delete(memberId, ratingId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}
