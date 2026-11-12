import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { MemberService } from "../service/member.service.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { LoginMember } from "../decorator/login-member.decorator.js";

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

  // URL에 누구의 정보인지 적지 않아요. AuthGuard가 토큰에서 알아낸 회원 ID를 @LoginMember()로 받아요.
  // @UseGuards(AuthGuard)를 빠뜨리면 토큰을 검사하지 않아서, @LoginMember()가 회원 ID를 찾지 못하고 500이 나요.
  @Get("me")
  @UseGuards(AuthGuard)
  async getMyInfo(@LoginMember() memberId: number) {
    const result = await this.memberService.getMyInfo(memberId);
    return ApiResponse.success("COMMON200", "회원 정보를 조회했습니다.", result);
  }

  @Patch("me")
  @UseGuards(AuthGuard)
  async updateMyInfo(@LoginMember() memberId: number, @Body() dto: MemberUpdateRequestDto) {
    const result = await this.memberService.updateMyInfo(memberId, dto);
    return ApiResponse.success("COMMON200", "회원 정보를 수정했습니다.", result);
  }
}
