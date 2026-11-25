const BASE_URL = "http://localhost:3000";

export interface CreateMemberRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface CheckResponse {
  available: boolean;
}

export interface CreateMemberResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

// 이메일 중복 확인
export async function checkEmail(email: string): Promise<CheckResponse> {
  const response = await fetch(
    `${BASE_URL}/members/email/${encodeURIComponent(email)}`,
  );

  if (!response.ok) {
    throw new Error("이메일 중복 확인에 실패했습니다.");
  }

  return response.json();
}

// 닉네임 중복 확인
export async function checkNickname(nickname: string): Promise<CheckResponse> {
  const response = await fetch(
    `${BASE_URL}/members/nickname/${encodeURIComponent(nickname)}`,
  );

  if (!response.ok) {
    throw new Error("닉네임 중복 확인에 실패했습니다.");
  }

  return response.json();
}

// 회원가입
export async function createMember(
  data: CreateMemberRequest,
): Promise<CreateMemberResponse> {
  const response = await fetch(`${BASE_URL}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.isSuccess) {
    throw new Error(result.message || "회원가입에 실패했습니다.");
  }

  return result;
}
