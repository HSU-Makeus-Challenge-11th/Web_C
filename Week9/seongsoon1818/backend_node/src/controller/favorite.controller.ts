import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { FavoriteService } from '../service/favorite.service';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { AuthGuard } from '../guard/auth.guard';
import { LoginMember } from '../decorator/login-member.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('즐겨찾기')
@ApiBearerAuth('bearerAuth')
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favorites: FavoriteService) {}

  @ApiOperation({ summary: '내 즐겨찾기 조회', description: '로그인한 회원의 즐겨찾기 목록을 조회합니다. Bearer 토큰이 필요합니다.' })
  @Get()
  async list(@LoginMember() memberId: number) {
    return { isSuccess: true, code: 'COMMON200', message: '즐겨찾기를 조회했습니다.', result: await this.favorites.list(memberId) };
  }

  @ApiOperation({ summary: '즐겨찾기 여부 조회', description: '로그인한 회원이 해당 영화를 즐겨찾기했는지 확인합니다. Bearer 토큰이 필요합니다.' })
  @Get(':movieId')
  async contains(@LoginMember() memberId: number, @Param('movieId', ParseIntPipe) movieId: number) {
    return { isSuccess: true, code: 'COMMON200', message: '즐겨찾기 상태를 조회했습니다.', result: { isFavorite: await this.favorites.contains(memberId, movieId) } };
  }

  @ApiOperation({
    summary: '즐겨찾기 등록',
    description: '토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다.',
  })
  // NestJS는 컨트롤러가 돌려주는 객체의 모양을 실행 중에 알 수 없어서, 응답 예시를 직접 적어줍니다.
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 등록 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON201',
        message: '즐겨찾기에 추가했습니다.',
        result: { favoriteId: 1, movieId: 550 },
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
        message: '이미 즐겨찾기에 등록된 영화입니다.',
        result: null,
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@LoginMember() memberId: number, @Body() body: CreateFavoriteDto) {
    return { isSuccess: true, code: 'COMMON201', message: '즐겨찾기에 추가했습니다.', result: await this.favorites.create(memberId, body.movieId) };
  }

  @ApiOperation({ summary: '즐겨찾기 해제', description: '로그인한 회원의 영화 즐겨찾기를 해제합니다. Bearer 토큰이 필요합니다.' })
  @Delete(':movieId')
  async remove(@LoginMember() memberId: number, @Param('movieId', ParseIntPipe) movieId: number) {
    await this.favorites.remove(memberId, movieId);
    return { isSuccess: true, code: 'COMMON200', message: '즐겨찾기를 삭제했습니다.', result: null };
  }
}
