import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { MovieRecordService } from "../service/movie-record.service.js";
import { CreateMovieRecordDto } from "../dto/create-movie-record.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { LoginMember } from "../decorator/login-member.decorator.js";

@Controller("movie-records")
@UseGuards(AuthGuard)
export class MovieRecordController {
  constructor(private readonly movieRecordService: MovieRecordService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@LoginMember() memberId: number, @Body() dto: CreateMovieRecordDto) {
    const result = await this.movieRecordService.create(memberId, dto);
    return ApiResponse.success("COMMON201", "영화 기록을 저장했습니다.", result);
  }
}
