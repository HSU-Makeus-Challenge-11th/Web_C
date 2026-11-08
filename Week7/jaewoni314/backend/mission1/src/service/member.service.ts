import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { Not, Repository } from "typeorm";
import { Member } from "../entity/member.entity.js";
import { CheckResponseDto } from "../dto/check-response.dto.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberResponseDto } from "../dto/member-response.dto.js";
import { MemberInfoResponseDto } from "../dto/member-info-response.dto.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";
import { BCRYPT_SALT_ROUNDS } from "../common/password.js";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    // 회원가입과 내 정보 수정처럼 앞뒤 공백을 지운 값으로 찾아야, 중복 체크 결과와 실제 가입 결과가 같아요.
    const exists = await this.memberRepository.exists({
      where: { nickname: nickname.trim() },
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

  async getMyInfo(memberId: number): Promise<MemberInfoResponseDto> {
    const member = await this.findMember(memberId);
    return MemberInfoResponseDto.from(member);
  }

  async updateMyInfo(memberId: number, dto: MemberUpdateRequestDto): Promise<MemberInfoResponseDto> {
    const member = await this.findMember(memberId);

    // 나를 뺀 다른 회원이 그 닉네임을 쓰고 있을 때만 막아요. 지금 내 닉네임을 그대로 보내도 통과해요.
    // DB에도 UNIQUE 제약이 있지만, 제약 위반 오류 대신 정해 둔 응답을 주려고 먼저 확인해요.
    const isDuplicated = await this.memberRepository.exists({
      where: { nickname: dto.nickname, memberId: Not(memberId) },
    });
    if (isDuplicated) {
      throw new ApiException(ErrorCodes.MEMBER_NICKNAME_DUPLICATED);
    }

    member.nickname = dto.nickname;
    const savedMember = await this.memberRepository.save(member);

    return MemberInfoResponseDto.from(savedMember);
  }

  private async findMember(memberId: number): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new ApiException(ErrorCodes.MEMBER_NOT_FOUND);
    }
    return member;
  }
}
