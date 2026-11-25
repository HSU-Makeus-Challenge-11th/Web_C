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
import { ApiOperation, ApiParam, ApiResponse as SwaggerResponse, ApiTags } from "@nestjs/swagger";
import { RatingService } from "../service/rating.service.js";
import { CreateRatingDto } from "../dto/create-rating.dto.js";
import { UpdateRatingDto } from "../dto/update-rating.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { ErrorCodes } from "../common/error-code.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { LoginMember } from "../decorator/login-member.decorator.js";
import { ApiAuth, ApiFail, ApiSuccess } from "../swagger/api-docs.js";

const RATING_EXAMPLE = {
  ratingId: 12,
  movieId: 550,
  score: 5,
  comment: "인생 영화예요.",
  createdAt: "2026-11-20T12:00:00.000Z",
  updatedAt: "2026-11-20T12:00:00.000Z",
};
const RATING_ID_PARAM = { name: "ratingId", description: "평점 ID", example: 12 };

// 등록/수정/삭제는 /ratings로 옮겨서 경로에 memberId를 받지 않아요.
// 경로에 남아 있으면 클라이언트가 그 값을 바꿔 보낼 수 있으니, 누구인지는 AuthGuard가 토큰에서 알아내고 @LoginMember()로 받아요.
@ApiTags("평점")
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // 5주차에 만든 유저별 평점 조회예요. 공개 API라 AuthGuard를 붙이지 않아요.
  @Get("members/:memberId/ratings")
  @ApiOperation({
    summary: "유저별 평점 조회 (공개)",
    description: "토큰 없이 누구의 평점 목록이든 볼 수 있어요. 최근 순(ratingId 내림차순)이고, 5주차부터 공통 응답 형식 없이 배열만 돌려줘요.",
  })
  @ApiParam({ name: "memberId", description: "평점 목록을 볼 회원 ID", example: 1 })
  @SwaggerResponse({ status: HttpStatus.OK, description: "평점 배열 (없으면 [])", schema: { example: [RATING_EXAMPLE] } })
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.MEMBER_NOT_FOUND)
  getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Post("ratings")
  @UseGuards(AuthGuard)
  @ApiAuth()
  @ApiOperation({ summary: "평점 등록", description: "토큰의 회원이 영화에 평점을 남겨요. 한 영화에 평점은 하나만 남길 수 있어요." })
  @HttpCode(HttpStatus.CREATED)
  @ApiSuccess(HttpStatus.CREATED, "COMMON201", "평점을 등록했습니다.", RATING_EXAMPLE)
  @ApiFail(
    HttpStatus.BAD_REQUEST,
    { code: "COMMON400", message: "별점은 5점 이하여야 합니다." },
    { code: "COMMON400", message: "영화 ID는 양수여야 합니다." },
  )
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.MEMBER_NOT_FOUND)
  @ApiFail(HttpStatus.CONFLICT, ErrorCodes.RATING_DUPLICATED)
  async create(@LoginMember() memberId: number, @Body() dto: CreateRatingDto) {
    const result = await this.ratingService.create(memberId, dto);
    return ApiResponse.success("COMMON201", "평점을 등록했습니다.", result);
  }

  @Patch("ratings/:ratingId")
  @UseGuards(AuthGuard)
  @ApiAuth()
  @ApiOperation({
    summary: "평점 수정",
    description: "내가 쓴 평점의 별점과 후기를 바꿔요. 후기를 빼고 보내면 후기를 지운 것으로 처리해요. 남의 평점이면 403이에요.",
  })
  @ApiParam(RATING_ID_PARAM)
  @ApiSuccess(HttpStatus.OK, "COMMON200", "평점을 수정했습니다.", { ...RATING_EXAMPLE, score: 4, comment: "다시 보니 4점이에요." })
  @ApiFail(HttpStatus.BAD_REQUEST, { code: "COMMON400", message: "별점은 1점 이상이어야 합니다." })
  @ApiFail(HttpStatus.FORBIDDEN, ErrorCodes.RATING_FORBIDDEN)
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.RATING_NOT_FOUND)
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
  @ApiAuth()
  @ApiOperation({ summary: "평점 삭제", description: "내가 쓴 평점을 지워요. 204가 아니라 200과 result: null이에요. 남의 평점이면 403이에요." })
  @HttpCode(HttpStatus.OK)
  @ApiParam(RATING_ID_PARAM)
  @ApiSuccess(HttpStatus.OK, "COMMON200", "평점을 삭제했습니다.", null)
  @ApiFail(HttpStatus.FORBIDDEN, ErrorCodes.RATING_FORBIDDEN)
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.RATING_NOT_FOUND)
  async delete(@LoginMember() memberId: number, @Param("ratingId", ParseIntPipe) ratingId: number) {
    await this.ratingService.delete(memberId, ratingId);
    return ApiResponse.success("COMMON200", "평점을 삭제했습니다.", null);
  }
}
