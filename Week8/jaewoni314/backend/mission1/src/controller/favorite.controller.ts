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
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { FavoriteService } from "../service/favorite.service.js";
import { CreateFavoriteDto } from "../dto/create-favorite.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { ErrorCodes } from "../common/error-code.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { LoginMember } from "../decorator/login-member.decorator.js";
import { ApiAuth, ApiFail, ApiSuccess } from "../swagger/api-docs.js";

const FAVORITE_EXAMPLE = { favoriteId: 3, movieId: 550, createdAt: "2026-11-12T10:46:25.000Z" };
const MOVIE_ID_PARAM = { name: "movieId", description: "TMDB 영화 ID", example: 550 };

// 즐겨찾기는 로그인한 회원의 데이터라서 모든 API에 AuthGuard를 붙여요.
// URL, 바디 어디에도 memberId를 받지 않고, 누구인지는 토큰에서 알아내 @LoginMember()로 받아요.
@ApiTags("즐겨찾기 (8주차)")
@ApiAuth()
@Controller("favorites")
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "즐겨찾기 등록", description: "토큰의 회원이 영화를 즐겨찾기해요. 바디에 memberId를 넣으면 400이에요." })
  @ApiSuccess(HttpStatus.CREATED, "COMMON201", "즐겨찾기를 등록했습니다.", FAVORITE_EXAMPLE)
  @ApiFail(HttpStatus.BAD_REQUEST, { code: "COMMON400", message: "영화 ID는 양수여야 합니다." })
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.MEMBER_NOT_FOUND)
  @ApiFail(HttpStatus.CONFLICT, ErrorCodes.FAVORITE_DUPLICATED)
  async create(@LoginMember() memberId: number, @Body() dto: CreateFavoriteDto) {
    const result = await this.favoriteService.create(memberId, dto);
    return ApiResponse.success("COMMON201", "즐겨찾기를 등록했습니다.", result);
  }

  @Get()
  @ApiOperation({ summary: "내 즐겨찾기 목록 조회", description: "최근에 등록한 순서(favoriteId 내림차순)예요. 없으면 빈 배열이에요." })
  @ApiSuccess(HttpStatus.OK, "COMMON200", "내 즐겨찾기 목록을 조회했습니다.", [FAVORITE_EXAMPLE])
  async getMyFavorites(@LoginMember() memberId: number) {
    const result = await this.favoriteService.getMyFavorites(memberId);
    return ApiResponse.success("COMMON200", "내 즐겨찾기 목록을 조회했습니다.", result);
  }

  @Get(":movieId")
  @ApiOperation({ summary: "즐겨찾기 여부 조회", description: "영화 상세 화면에서 이 영화가 내 즐겨찾기인지 물어요. 즐겨찾기하지 않았어도 200이에요." })
  @ApiParam(MOVIE_ID_PARAM)
  @ApiSuccess(HttpStatus.OK, "COMMON200", "즐겨찾기 여부를 조회했습니다.", { isFavorite: true })
  async getStatus(@LoginMember() memberId: number, @Param("movieId", ParseIntPipe) movieId: number) {
    const result = await this.favoriteService.getStatus(memberId, movieId);
    return ApiResponse.success("COMMON200", "즐겨찾기 여부를 조회했습니다.", result);
  }

  // 평점 삭제처럼 공통 응답 형식을 유지하려고 204 대신 200과 result: null로 응답해요.
  @Delete(":movieId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "즐겨찾기 해제", description: "favoriteId가 아니라 movieId로 지정해요. 204가 아니라 200과 result: null이에요." })
  @ApiParam(MOVIE_ID_PARAM)
  @ApiSuccess(HttpStatus.OK, "COMMON200", "즐겨찾기를 해제했습니다.", null)
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.FAVORITE_NOT_FOUND)
  async delete(@LoginMember() memberId: number, @Param("movieId", ParseIntPipe) movieId: number) {
    await this.favoriteService.delete(memberId, movieId);
    return ApiResponse.success("COMMON200", "즐겨찾기를 해제했습니다.", null);
  }
}
