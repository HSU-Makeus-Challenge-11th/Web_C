import { isHTTPError } from "ky";

function readMessage(data: unknown): string | undefined {
  if (typeof data === "object" && data !== null && "message" in data) {
    const { message } = data as { message: unknown };
    if (typeof message === "string" && message.length > 0) return message;
  }

  return undefined;
}

// 서버가 오류 응답에 담아 준 message를 꺼내요. 없으면 fallback을 써요.
export async function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isHTTPError(error)) return fallback;

  const parsedData = (error as unknown as { data?: unknown }).data;
  const messageFromData = readMessage(parsedData);
  if (messageFromData) return messageFromData;

  try {
    const body: unknown = await error.response.clone().json();
    return readMessage(body) ?? fallback;
  } catch {
    return fallback;
  }
}
