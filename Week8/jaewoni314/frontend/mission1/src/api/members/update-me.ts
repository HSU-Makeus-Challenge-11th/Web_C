import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";
import type { ApiResponse } from "./models";

interface UpdateMeRequest {
  nickname: string;
}

// PATCH /members/me: 성공 응답의 result가 내 정보 조회와 같은 형태(이메일, 수정된 닉네임, 가입 시각)예요.
async function updateMe(body: UpdateMeRequest) {
  const response = await authApi.patch("members/me", { json: body }).json<ApiResponse<MemberInfo>>();
  return response.result;
}

export { updateMe };
export type { UpdateMeRequest };
