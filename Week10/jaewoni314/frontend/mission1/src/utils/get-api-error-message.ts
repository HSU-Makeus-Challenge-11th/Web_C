import { isHTTPError } from "ky";

// 서버가 { isSuccess: false, code, message } 형식으로 실패 이유를 보내면 그 message를 보여 줘요.
// ky 2에서는 응답 본문을 error.data에 미리 읽어 두므로 error.response.json()은 쓸 수 없어요.
export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  // 응답 자체를 받지 못했어요. (서버 꺼짐, CORS 차단 등)
  if (!isHTTPError(error)) {
    return "서버에 연결하지 못했어요. 백엔드 서버가 켜져 있는지 확인해 주세요.";
  }

  const { data } = error;
  if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
    return data.message;
  }
  return fallbackMessage;
}
