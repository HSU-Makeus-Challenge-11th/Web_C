import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { MemberService } from "../service/member.service.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";
import { ApiResponse } from "../common/api-response.js";
// AuthenticatedRequest는 데코레이터가 붙은 매개변수의 타입이라 type으로 가져와야 빌드돼요.
import { AuthGuard, type AuthenticatedRequest } from "../guard/auth.guard.js";

@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get("nickname/:nickname")
  checkNickname(@Param("nickname") nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @Get("email/:email")
  checkEmail(@Param("email") email: string) {
    return this.memberService.checkEmail(email);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);
    return ApiResponse.success("COMMON201", "회원가입에 성공했습니다.", result);
  }

  // URL에 누구의 정보인지 적지 않아요. AuthGuard가 토큰에서 알아낸 회원 ID를 써요.
  @Get("me")
  @UseGuards(AuthGuard) // 이 줄이 있어야 컨트롤러보다 먼저 토큰을 검사하고 회원 ID를 요청에 담아요.
  async getMyInfo(@Req() request: AuthenticatedRequest) {
    const memberId = request.memberId;

    const result = await this.memberService.getMyInfo(memberId);
    return ApiResponse.success("COMMON200", "회원 정보를 조회했습니다.", result);
  }

  @Patch("me")
  @UseGuards(AuthGuard)
  async updateMyInfo(@Req() request: AuthenticatedRequest, @Body() dto: MemberUpdateRequestDto) {
    const memberId = request.memberId;

    const result = await this.memberService.updateMyInfo(memberId, dto);
    return ApiResponse.success("COMMON200", "회원 정보를 수정했습니다.", result);
  }
}
