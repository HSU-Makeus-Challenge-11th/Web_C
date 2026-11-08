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
  UseGuards,
} from "@nestjs/common";
import { RatingService } from "../service/rating.service.js";
import { CreateRatingDto } from "../dto/create-rating.dto.js";
import { UpdateRatingDto } from "../dto/update-rating.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { LoginMember } from "../decorator/login-member.decorator.js";

// 등록/수정/삭제는 /ratings로 옮겨서 경로에 memberId를 받지 않아요.
// 경로에 남아 있으면 클라이언트가 그 값을 바꿔 보낼 수 있으니, 누구인지는 AuthGuard가 토큰에서 알아내고 @LoginMember()로 받아요.
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // 5주차에 만든 유저별 평점 조회예요. 공개 API라 AuthGuard를 붙이지 않아요.
  @Get("members/:memberId/ratings")
  getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Post("ratings")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@LoginMember() memberId: number, @Body() dto: CreateRatingDto) {
    const result = await this.ratingService.create(memberId, dto);
    return ApiResponse.success("COMMON201", "평점을 등록했습니다.", result);
  }

  @Patch("ratings/:ratingId")
  @UseGuards(AuthGuard)
  async update(
    @LoginMember() memberId: number,
    @Param("ratingId", ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const result = await this.ratingService.update(memberId, ratingId, dto);
    return ApiResponse.success("COMMON200", "평점을 수정했습니다.", result);
  }

  // 204는 본문을 보내지 않는 상태 코드라 공통 응답 형식을 실을 수 없어요.
  // 다른 API와 같은 형식으로 응답하려고 200을 쓰고 result에 null을 담아요.
  @Delete("ratings/:ratingId")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@LoginMember() memberId: number, @Param("ratingId", ParseIntPipe) ratingId: number) {
    await this.ratingService.delete(memberId, ratingId);
    return ApiResponse.success("COMMON200", "평점을 삭제했습니다.", null);
  }
}
