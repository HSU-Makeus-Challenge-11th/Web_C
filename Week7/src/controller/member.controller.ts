// src/controller/member.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-member.dto.js';
import { MemberService } from '../service/member.service.js';
import { AuthGuard, type AuthenticatedRequest } from '../guard/auth.guard.js';
import { MemberInfoResponseDto } from '../dto/member-info-response.dto.js';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto.js';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // src/controller/member.controller.ts 에 아래 메서드를 추가합니다
  @Get('me')
  @UseGuards(AuthGuard) // 이 줄이 없으면 토큰 없이도 호출됩니다
  async getMyInfo(@Req() request: AuthenticatedRequest) {
    // 👈 Request를 AuthenticatedRequest로 변경
    // Guard가 request["memberId"]에 담아둔 값을 꺼냅니다
    const memberId = request['memberId'] as number;

    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  // src/controller/member.controller.ts 에 아래 메서드를 추가합니다
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: AuthenticatedRequest,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.memberService.updateMyInfo(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }

  @Get('nickname/:nickname')
  checkNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @Get('email/:email')
  checkEmail(@Param('email') email: string) {
    return this.memberService.checkEmail(email);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result,
    };
  }
}
