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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: '닉네임 중복 확인', description: '닉네임 사용 가능 여부를 확인합니다. 토큰 없이 호출할 수 있습니다.' })
  @Get('nickname/:nickname')
  checkNickname(@Param() { nickname }: NicknameParamsDto) {
    return this.memberService.checkNickname(nickname);
  }

  @ApiOperation({ summary: '이메일 중복 확인', description: '이메일 사용 가능 여부를 확인합니다. 토큰 없이 호출할 수 있습니다.' })
  @Get('email/:email')
  checkEmail(@Param() { email }: EmailParamsDto) {
    return this.memberService.checkEmail(email);
  }

  @ApiOperation({
    summary: '회원가입',
    description: '이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
  })
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

  @ApiOperation({ summary: '내 정보 조회', description: '로그인한 회원의 정보를 조회합니다. Bearer 토큰이 필요합니다.' })
  @ApiBearerAuth('bearerAuth')
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

  @ApiOperation({ summary: '내 정보 수정', description: '로그인한 회원의 닉네임을 수정합니다. Bearer 토큰이 필요합니다.' })
  @ApiBearerAuth('bearerAuth')
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
