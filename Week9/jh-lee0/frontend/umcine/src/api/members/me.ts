import { authApi } from "../auth-api";

export interface MemberInfo {
  memberId: number; // 8주차 미션 2 추가: 백엔드 응답에 추가된 회원 번호 (미션 7 평점 조회에 사용)
  email: string;
  nickname: string;
  createdAt: string;
}

interface MeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

export async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<MeResponse>();
  return response.result;
}