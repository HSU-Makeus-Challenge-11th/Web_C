import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { Member } from "../entity/member.entity.js";
import { LoginRequestDto } from "../dto/login-request.dto.js";
import { LoginResponseDto } from "../dto/login-response.dto.js";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    // 1. 이메일로 회원을 찾아요.
    //    없어도 "가입되지 않은 이메일"이라고 알려 주지 않고, 비밀번호가 틀렸을 때와 같은 오류를 던져요.
    const member = await this.memberRepository.findOne({
      where: { email: dto.email },
    });
    if (!member) {
      throw new ApiException(ErrorCodes.AUTH_LOGIN_FAILED);
    }

    // 2. 입력한 비밀번호를 저장된 해시와 비교해요.
    //    compare()가 저장된 해시에서 salt를 꺼내 같은 방식으로 해시한 뒤 대조해요.
    const isPasswordMatched = await bcrypt.compare(dto.password, member.password);
    if (!isPasswordMatched) {
      throw new ApiException(ErrorCodes.AUTH_LOGIN_FAILED);
    }

    // 3. 통과했으니 토큰을 발급해요. sub는 JWT 표준에서 "이 토큰의 주인"을 뜻하는 항목이에요.
    const accessToken = await this.jwtService.signAsync({
      sub: String(member.memberId),
      email: member.email,
    });

    return { nickname: member.nickname, accessToken };
  }
}
