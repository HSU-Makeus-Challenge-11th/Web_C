import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { CreateFavoriteDto } from '../dto/create-favorite.dto.js';
import { AuthGuard, type AuthenticatedRequest } from '../guard/auth.guard.js';
import { FavoriteService } from '../service/favorite.service.js';

@ApiTags('즐겨찾기')
@ApiBearerAuth('bearerAuth')
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({
    summary: '즐겨찾기 등록',
    description:
      '토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다. (인증 토큰 필요)',
  })
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 등록 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON201',
        message: '즐겨찾기를 등록했습니다.',
        result: {
          favoriteId: 1,
          movieId: 550,
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
    description: '이미 즐겨찾기한 영화',
    schema: {
      example: {
        isSuccess: false,
        code: 'FAVORITE409_1',
        message: '이미 이 영화를 즐겨찾기하셨습니다.',
        result: null,
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateFavoriteDto,
  ) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '즐겨찾기를 등록했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '내 즐겨찾기 목록 조회',
    description:
      '로그인한 회원이 즐겨찾기한 영화 목록을 최신순으로 조회합니다. (인증 토큰 필요)',
  })
  @ApiResponse({
    status: 200,
    description: '내 즐겨찾기 목록 조회 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '즐겨찾기 목록을 조회했습니다.',
        result: [
          {
            favoriteId: 1,
            movieId: 550,
            createdAt: '2026-09-13T21:00:00.000Z',
          },
        ],
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
  @Get()
  async getMyFavorites(@Req() request: AuthenticatedRequest) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getMyFavorites(memberId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 목록을 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 여부 조회',
    description:
      '로그인한 회원이 특정 TMDB 영화를 즐겨찾기했는지 여부를 조회합니다. (인증 토큰 필요)',
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 여부 조회 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '즐겨찾기 여부를 조회했습니다.',
        result: { isFavorite: false },
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
  @Get(':movieId')
  async getStatus(
    @Req() request: AuthenticatedRequest,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getStatus(memberId, movieId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 여부를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 해제',
    description:
      '로그인한 회원의 즐겨찾기 목록에서 특정 TMDB 영화를 삭제합니다. (인증 토큰 필요)',
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 해제 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '즐겨찾기를 삭제했습니다.',
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
    status: 404,
    description: '즐겨찾기 내역을 찾을 수 없음',
    schema: {
      example: {
        isSuccess: false,
        code: 'FAVORITE404_1',
        message: '즐겨찾기한 영화를 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @Delete(':movieId')
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;
    await this.favoriteService.delete(memberId, movieId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기를 삭제했습니다.',
      result: null,
    };
  }
}
