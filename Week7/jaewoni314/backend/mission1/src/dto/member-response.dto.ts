import { Member } from "../entity/member.entity.js";

// 비밀번호(해시 포함)는 응답에 절대 넣지 않아요.
export class MemberResponseDto {
  memberId: number;
  email: string;
  nickname: string;

  static from(member: Member): MemberResponseDto {
    return {
      memberId: member.memberId,
      email: member.email,
      nickname: member.nickname,
    };
  }
}
