import { Injectable, ConflictException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository, Not } from 'typeorm';
import { Member } from '../entity/member.entity';
import { CheckResponseDto } from '../dto/check-response.dto';
import { CreateMemberDto } from '../dto/create-member-dto';
import { API_ERRORS } from '../error/api-errors';
import { ApiException } from '../exception/api.exception';
import { MemberInfoResponseDto } from '../dto/member-info-response.dto';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';

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

  async signUp(dto: CreateMemberDto) {
    const existingEmail = await this.memberRepository.findOneBy({
      email: dto.email,
    });
    if (existingEmail) {
      throw new ConflictException(API_ERRORS.duplicateEmail);
    }

    const existingNickname = await this.memberRepository.findOneBy({
      nickname: dto.nickname,
    });
    if (existingNickname) {
      throw new ConflictException(API_ERRORS.duplicateNickname);
    }

    const savedMember = await this.memberRepository.save(
      this.memberRepository.create({
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        nickname: dto.nickname,
      }),
    );

    return {
      memberId: savedMember.memberId,
      email: savedMember.email,
      nickname: savedMember.nickname,
    };
  }

  async getMyInfo(memberId: number): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { memberId },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '해당 회원을 찾을 수 없습니다.',
      );
    }

    return MemberInfoResponseDto.from(member);
  }

  async updateMyInfo(
    memberId: number,
    dto: MemberUpdateRequestDto,
  ): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { memberId },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '해당 회원을 찾을 수 없습니다.',
      );
    }

    // 나를 제외한 다른 회원이 그 닉네임을 쓰고 있다면 막습니다.
    // DB에도 UNIQUE 제약이 걸려 있지만, 제약 위반 예외 대신 우리가 정한 응답을 주기 위해 먼저 확인합니다.
    const duplicated = await this.memberRepository.findOne({
      where: { nickname: dto.nickname, memberId: Not(memberId) },
    });

    if (duplicated) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        'MEMBER409_1',
        '이미 사용 중인 닉네임입니다.',
      );
    }

    member.nickname = dto.nickname;
    await this.memberRepository.save(member);

    return MemberInfoResponseDto.from(member);
  }
}
