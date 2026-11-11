import {
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { MemberService } from '../service/member.service';
import {
  EmailParamsDto,
  NicknameParamsDto,
} from '../dto/member-check-params.dto';
import { CreateMemberDto } from '../dto/create-member-dto';
import { AuthGuard } from '../guard/auth.guard';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';
import { LoginMember } from '../decorator/login-member.decorator';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('nickname/:nickname')
  checkNickname(@Param() { nickname }: NicknameParamsDto) {
    return this.memberService.checkNickname(nickname);
  }

  @Get('email/:email')
  checkEmail(@Param() { email }: EmailParamsDto) {
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

  @Get('me')
  @UseGuards(AuthGuard) // 이 줄이 없으면 토큰 없이도 호출됩니다
  async getMyInfo(@LoginMember() memberId: number) {
    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @LoginMember() memberId: number,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const result = await this.memberService.updateMyInfo(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }
}
