import { Member } from "../entity/member.entity.js";

// 엔티티를 그대로 응답하면 password까지 나가므로, 필요한 값만 옮겨 담아요.
export class MemberInfoResponseDto {
  email: string;
  nickname: string;
  createdAt: Date;

  static from(member: Member): MemberInfoResponseDto {
    return {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    };
  }
}
