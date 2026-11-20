import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MovieRecordService } from "../service/movie-record.service.js";
import { CreateMovieRecordDto } from "../dto/create-movie-record.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { ErrorCodes } from "../common/error-code.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { LoginMember } from "../decorator/login-member.decorator.js";
import { ApiAuth, ApiFail, ApiSuccess } from "../swagger/api-docs.js";

@ApiTags("영화 기록 (8주차)")
@ApiAuth()
@Controller("movie-records")
@UseGuards(AuthGuard)
export class MovieRecordController {
  constructor(private readonly movieRecordService: MovieRecordService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "영화 기록 저장 (평점 + 즐겨찾기)",
    description:
      "평점과 즐겨찾기를 한 트랜잭션으로 저장해요. 하나라도 실패하면 둘 다 저장되지 않아요(rollback). addToFavorites가 false면 favorite은 null이에요.",
  })
  @ApiSuccess(HttpStatus.CREATED, "COMMON201", "영화 기록을 저장했습니다.", {
    rating: {
      ratingId: 56,
      movieId: 238,
      score: 5,
      comment: "다시 보고 싶은 영화입니다.",
      createdAt: "2026-11-12T10:46:25.000Z",
      updatedAt: "2026-11-12T10:46:25.000Z",
    },
    favorite: { favoriteId: 2, movieId: 238, createdAt: "2026-11-12T10:46:25.000Z" },
  })
  @ApiFail(HttpStatus.BAD_REQUEST, { code: "COMMON400", message: "즐겨찾기 추가 여부는 true 또는 false여야 합니다." })
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.MEMBER_NOT_FOUND)
  @ApiFail(HttpStatus.CONFLICT, ErrorCodes.RATING_DUPLICATED, ErrorCodes.FAVORITE_DUPLICATED)
  async create(@LoginMember() memberId: number, @Body() dto: CreateMovieRecordDto) {
    const result = await this.movieRecordService.create(memberId, dto);
    return ApiResponse.success("COMMON201", "영화 기록을 저장했습니다.", result);
  }
}
