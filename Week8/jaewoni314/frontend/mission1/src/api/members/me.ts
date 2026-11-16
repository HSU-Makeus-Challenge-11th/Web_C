import { authApi } from "../auth-api";
import type { ApiResponse } from "./models";

interface MemberInfo {
  email: string;
  nickname: string;
  // ISO 날짜 문자열 (예: 2026-11-12T10:46:25.000Z)
  createdAt: string;
}

type MeResponse = ApiResponse<MemberInfo>;

// 화면에서는 공통 응답 형식을 벗긴 회원 정보만 써요. 그래야 수정 응답의 result로 캐시를 바로 바꿀 수 있어요.
async function getMe() {
  const response = await authApi.get("members/me").json<MeResponse>();
  return response.result;
}

export { getMe };
export type { MemberInfo, MeResponse };
