export function getMemberIdFromToken(token: string | null): number | undefined {
  if (!token) return undefined;

  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const memberId = Number(JSON.parse(json).sub);

    return Number.isInteger(memberId) ? memberId : undefined;
  } catch {
    return undefined; // 토큰 형식이 이상하면 없는 것으로 취급해요
  }
}