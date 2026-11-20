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
import { BCRYPT_SALT_ROUNDS } from "../common/password.js";

// 가입되지 않은 이메일일 때 비교할 가짜 해시예요. 회원가입과 같은 cost(BCRYPT_SALT_ROUNDS)로 만들어서 비교 시간이 같아요.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("dummy-password-for-timing", BCRYPT_SALT_ROUNDS);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    // 1. 이메일로 회원을 찾아요.
    const member = await this.memberRepository.findOne({
      where: { email: dto.email },
    });

    // 2. 입력한 비밀번호를 저장된 해시와 비교해요.
    //    compare()가 저장된 해시에서 salt를 꺼내 같은 방식으로 해시한 뒤 대조해요.
    //    회원이 없어도 가짜 해시와 한 번 비교해서, 응답 시간만으로 가입 여부를 알 수 없게 해요.
    const isPasswordMatched = await bcrypt.compare(dto.password, member?.password ?? DUMMY_PASSWORD_HASH);

    // 이메일이 없을 때와 비밀번호가 틀렸을 때 같은 오류를 던져요. 나눠서 알려 주면 가입된 이메일을 알아낼 수 있어요.
    if (!member || !isPasswordMatched) {
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
