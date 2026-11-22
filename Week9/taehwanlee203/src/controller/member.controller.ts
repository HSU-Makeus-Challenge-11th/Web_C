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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMemberDto } from '../dto/create-member.dto.js';
import { MemberService } from '../service/member.service.js';
import { AuthGuard, type AuthenticatedRequest } from '../guard/auth.guard.js';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto.js';

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({
    summary: '회원가입',
    description:
      '이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
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

  @ApiOperation({
    summary: '내 정보 조회',
    description:
      '로그인한 회원의 프로필(이메일, 닉네임 등)을 조회합니다. (인증 토큰 필요)',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 200,
    description: '내 정보 조회 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '회원 정보를 조회했습니다.',
        result: {
          memberId: 1,
          email: 'challenger@umc.com',
          nickname: '영화조아',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 회원',
    schema: {
      example: {
        isSuccess: false,
        code: 'MEMBER404_1',
        message: '해당 회원을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @Get('me')
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: AuthenticatedRequest) {
    const memberId = request['memberId'] as number;

    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '내 정보 수정',
    description: '로그인한 회원의 닉네임을 수정합니다. (인증 토큰 필요)',
  })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 200,
    description: '내 정보 수정 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '회원 정보를 수정했습니다.',
        result: {
          memberId: 1,
          email: 'challenger@umc.com',
          nickname: '시네마러버',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '이미 사용 중인 닉네임',
    schema: {
      example: {
        isSuccess: false,
        code: 'MEMBER409_2',
        message: '이미 사용 중인 닉네임입니다.',
        result: null,
      },
    },
  })
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

  @ApiOperation({
    summary: '닉네임 중복 확인',
    description:
      '입력한 닉네임의 사용 가능 여부를 확인합니다. 토큰 없이 호출 가능한 공개 API입니다.',
  })
  @Get('nickname/:nickname')
  checkNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @ApiOperation({
    summary: '이메일 중복 확인',
    description:
      '입력한 이메일의 사용 가능 여부를 확인합니다. 토큰 없이 호출 가능한 공개 API입니다.',
  })
  @Get('email/:email')
  checkEmail(@Param('email') email: string) {
    return this.memberService.checkEmail(email);
  }
}
