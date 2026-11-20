import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse as SwaggerResponse, ApiTags } from "@nestjs/swagger";
import { MemberService } from "../service/member.service.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";
import { ApiResponse } from "../common/api-response.js";
import { ErrorCodes } from "../common/error-code.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { LoginMember } from "../decorator/login-member.decorator.js";
import { ApiAuth, ApiFail, ApiSuccess } from "../swagger/api-docs.js";

const MEMBER_INFO_EXAMPLE = { email: "challenger@umc.com", nickname: "영화조아", createdAt: "2026-11-20T12:00:00.000Z" };

@ApiTags("회원")
@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 중복 체크는 5주차부터 공통 응답 형식 없이 { available }만 돌려줘요. 화면이 이미 이 모양을 쓰고 있어서 그대로 문서화했어요.
  @Get("nickname/:nickname")
  @ApiOperation({
    summary: "닉네임 중복 체크 (공개)",
    description: "토큰 없이 부를 수 있어요. 앞뒤 공백을 지운 닉네임으로 찾아요. 공통 응답 형식 없이 { available }만 돌려줘요.",
  })
  @ApiParam({ name: "nickname", description: "확인할 닉네임", example: "영화조아" })
  @SwaggerResponse({ status: HttpStatus.OK, description: "사용할 수 있으면 true", schema: { example: { available: true } } })
  checkNickname(@Param("nickname") nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @Get("email/:email")
  @ApiOperation({
    summary: "이메일 중복 체크 (공개)",
    description: "토큰 없이 부를 수 있어요. 공통 응답 형식 없이 { available }만 돌려줘요.",
  })
  @ApiParam({ name: "email", description: "확인할 이메일", example: "challenger@umc.com" })
  @SwaggerResponse({ status: HttpStatus.OK, description: "이미 가입된 이메일이면 false", schema: { example: { available: false } } })
  checkEmail(@Param("email") email: string) {
    return this.memberService.checkEmail(email);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "회원가입 (공개)",
    description: "이메일, 비밀번호, 닉네임으로 회원을 등록해요. 토큰이 없어도 호출할 수 있는 공개 API예요.",
  })
  @ApiSuccess(HttpStatus.CREATED, "COMMON201", "회원가입에 성공했습니다.", {
    memberId: 1,
    email: "challenger@umc.com",
    nickname: "영화조아",
  })
  @ApiFail(
    HttpStatus.BAD_REQUEST,
    { code: "COMMON400", message: "올바른 이메일 형식이 아닙니다." },
    { code: "COMMON400", message: "비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다." },
  )
  @ApiFail(HttpStatus.CONFLICT, ErrorCodes.MEMBER_EMAIL_DUPLICATED, ErrorCodes.MEMBER_NICKNAME_DUPLICATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);
    return ApiResponse.success("COMMON201", "회원가입에 성공했습니다.", result);
  }

  // URL에 누구의 정보인지 적지 않아요. AuthGuard가 토큰에서 알아낸 회원 ID를 @LoginMember()로 받아요.
  // @UseGuards(AuthGuard)를 빠뜨리면 토큰을 검사하지 않아서, @LoginMember()가 회원 ID를 찾지 못하고 500이 나요.
  @Get("me")
  @UseGuards(AuthGuard)
  @ApiAuth()
  @ApiOperation({ summary: "내 정보 조회", description: "토큰의 회원 정보를 조회해요. 비밀번호는 응답에 담지 않아요." })
  @ApiSuccess(HttpStatus.OK, "COMMON200", "회원 정보를 조회했습니다.", MEMBER_INFO_EXAMPLE)
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.MEMBER_NOT_FOUND)
  async getMyInfo(@LoginMember() memberId: number) {
    const result = await this.memberService.getMyInfo(memberId);
    return ApiResponse.success("COMMON200", "회원 정보를 조회했습니다.", result);
  }

  @Patch("me")
  @UseGuards(AuthGuard)
  @ApiAuth()
  @ApiOperation({
    summary: "내 정보 수정",
    description: "토큰의 회원 닉네임을 바꿔요. 지금 내 닉네임을 그대로 보내도 통과하고, 다른 회원이 쓰는 닉네임이면 409예요.",
  })
  @ApiSuccess(HttpStatus.OK, "COMMON200", "회원 정보를 수정했습니다.", { ...MEMBER_INFO_EXAMPLE, nickname: "새닉네임" })
  @ApiFail(HttpStatus.BAD_REQUEST, { code: "COMMON400", message: "닉네임은 2자 이상이어야 합니다." })
  @ApiFail(HttpStatus.NOT_FOUND, ErrorCodes.MEMBER_NOT_FOUND)
  @ApiFail(HttpStatus.CONFLICT, ErrorCodes.MEMBER_NICKNAME_DUPLICATED)
  async updateMyInfo(@LoginMember() memberId: number, @Body() dto: MemberUpdateRequestDto) {
    const result = await this.memberService.updateMyInfo(memberId, dto);
    return ApiResponse.success("COMMON200", "회원 정보를 수정했습니다.", result);
  }
}
