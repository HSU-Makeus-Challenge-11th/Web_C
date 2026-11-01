export const MAX_TMDB_PAGE = 500;

// URL은 사용자가 직접 바꿀 수 있으므로 TMDB에 보내기 전에 검사합니다.
export function parseMoviePage(value: unknown): number {
  if (typeof value !== "string" && typeof value !== "number") return 1;
  if (typeof value === "string" && !/^\d+$/.test(value.trim())) return 1;

  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= MAX_TMDB_PAGE
    ? page
    : 1;
}
