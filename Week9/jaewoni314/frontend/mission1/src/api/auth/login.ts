import type { ApiResponse } from "../members/models";
import { umcClient } from "../umc-client";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResult {
  nickname: string;
  accessToken: string;
}

type LoginResponse = ApiResponse<LoginResult>;

// 로그인은 토큰이 없을 때 하는 요청이라 authApi가 아닌 umcClient로 보내요.
// authApi로 보내면 비밀번호가 틀린 401에도 토큰을 비우는 처리가 끼어들어요.
function login(body: LoginRequest) {
  return umcClient.post("auth/login", { json: body }).json<LoginResponse>();
}

export { login };
export type { LoginRequest, LoginResponse, LoginResult };
