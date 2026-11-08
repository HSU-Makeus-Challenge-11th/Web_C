const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// 내 정보 응답 데이터
export interface MyInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    email: string;
    nickname: string;
    createdAt: string;
  };
}

// 내 정보 조회 API
export async function getMyInfo(): Promise<MyInfoResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${BASE_URL}/members/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.isSuccess) {
    throw new Error(result.message || "회원 정보를 불러오지 못했습니다.");
  }

  return result;
}
