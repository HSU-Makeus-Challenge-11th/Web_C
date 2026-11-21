// src/service/member.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity.js';
import { CheckResponseDto } from '../dto/check-response.dto.js';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateMemberDto } from '../dto/create-member.dto.js';

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

  // src/service/member.service.ts 에 아래 메서드를 추가합니다
  async signUp(dto: CreateMemberDto) {
    const existingEmail = await this.memberRepository.findOneBy({
      email: dto.email,
    });
    if (existingEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    const existingNickname = await this.memberRepository.findOneBy({
      nickname: dto.nickname,
    });
    if (existingNickname) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
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
}
