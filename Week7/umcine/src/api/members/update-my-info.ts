const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// 내 정보 수정 요청 데이터
export interface UpdateMyInfoRequest {
  nickname: string;
}

// 내 정보 수정 응답 데이터
export interface UpdateMyInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    email: string;
    nickname: string;
    createdAt: string;
  };
}

// 내 정보 수정 API
export async function updateMyInfo(
  data: UpdateMyInfoRequest,
): Promise<UpdateMyInfoResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${BASE_URL}/members/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.isSuccess) {
    throw new Error(result.message || "회원 정보 수정에 실패했습니다.");
  }

  return result;
}
