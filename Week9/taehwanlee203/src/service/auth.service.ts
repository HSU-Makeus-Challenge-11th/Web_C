// src/service/auth.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Member } from '../entity/member.entity.js';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { LoginResponseDto } from '../dto/login-response.dto.js';
import { ApiException } from '../exception/api.exception.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    // 1. 이메일로 회원을 찾습니다.
    //    없어도 "가입되지 않은 이메일"이라고 알려주지 않고 아래와 같은 예외를 던집니다.
    const member = await this.memberRepository.findOne({
      where: { email: dto.email },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_1',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 2. 입력한 비밀번호를 저장된 해시와 비교합니다.
    //    compare()가 저장된 해시에서 salt를 꺼내 같은 방식으로 해시한 뒤 대조해줍니다.
    const isPasswordMatched = await bcrypt.compare(
      dto.password,
      member.password,
    );

    if (!isPasswordMatched) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_1',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // 3. 검증을 통과했으니 토큰을 발급합니다.
    //    sub는 JWT 표준에서 "이 토큰의 주인"을 뜻하는 항목입니다.
    const accessToken = await this.jwtService.signAsync({
      sub: String(member.memberId),
      email: member.email,
    });

    return {
      nickname: member.nickname,
      accessToken,
    };
  }
}
