import { Member } from '../entity/member.entity';

export class MemberInfoResponseDto {
  email: string;
  nickname: string;
  createdAt: Date;

  // 엔티티를 그대로 응답하면 password까지 나가버리므로 반드시 DTO로 옮겨 담습니다
  static from(member: Member): MemberInfoResponseDto {
    return {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    };
  }
}
