const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// 로그인 요청 데이터
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 데이터
export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
}

// 로그인 API
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.isSuccess) {
    throw new Error(
      result.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
    );
  }

  return result;
}
