import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { Member } from "../entity/member.entity.js";
import { CheckResponseDto } from "../dto/check-response.dto.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberResponseDto } from "../dto/member-response.dto.js";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({
      where: { nickname },
    });
    return { available: !exists };
  }

  async checkEmail(email: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { email } });
    return { available: !exists };
  }

  async signUp(dto: CreateMemberDto): Promise<MemberResponseDto> {
    if (await this.memberRepository.exists({ where: { email: dto.email } })) {
      throw new ApiException(ErrorCodes.MEMBER_EMAIL_DUPLICATED);
    }
    if (await this.memberRepository.exists({ where: { nickname: dto.nickname } })) {
      throw new ApiException(ErrorCodes.MEMBER_NICKNAME_DUPLICATED);
    }

    // 동시에 같은 값으로 가입하면 위 확인을 둘 다 통과할 수 있어요.
    // 그때는 DB UNIQUE 제약이 막고, 전역 필터가 같은 409 오류로 바꿔 줘요.
    const savedMember = await this.memberRepository.save(
      this.memberRepository.create({
        email: dto.email,
        password: await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS),
        nickname: dto.nickname,
      }),
    );

    return MemberResponseDto.from(savedMember);
  }
}
