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
import { FavoriteService } from "../service/favorite.service.js";
import { CreateFavoriteDto } from "../dto/create-favorite.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { LoginMember } from "../decorator/login-member.decorator.js";

// 즐겨찾기는 로그인한 회원의 데이터라서 모든 API에 AuthGuard를 붙여요.
// URL, 바디 어디에도 memberId를 받지 않고, 누구인지는 토큰에서 알아내 @LoginMember()로 받아요.
@Controller("favorites")
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@LoginMember() memberId: number, @Body() dto: CreateFavoriteDto) {
    const result = await this.favoriteService.create(memberId, dto);
    return ApiResponse.success("COMMON201", "즐겨찾기를 등록했습니다.", result);
  }

  @Get()
  async getMyFavorites(@LoginMember() memberId: number) {
    const result = await this.favoriteService.getMyFavorites(memberId);
    return ApiResponse.success("COMMON200", "내 즐겨찾기 목록을 조회했습니다.", result);
  }

  @Get(":movieId")
  async getStatus(@LoginMember() memberId: number, @Param("movieId", ParseIntPipe) movieId: number) {
    const result = await this.favoriteService.getStatus(memberId, movieId);
    return ApiResponse.success("COMMON200", "즐겨찾기 여부를 조회했습니다.", result);
  }

  // 평점 삭제처럼 공통 응답 형식을 유지하려고 204 대신 200과 result: null로 응답해요.
  @Delete(":movieId")
  @HttpCode(HttpStatus.OK)
  async delete(@LoginMember() memberId: number, @Param("movieId", ParseIntPipe) movieId: number) {
    await this.favoriteService.delete(memberId, movieId);
    return ApiResponse.success("COMMON200", "즐겨찾기를 해제했습니다.", null);
  }
}
