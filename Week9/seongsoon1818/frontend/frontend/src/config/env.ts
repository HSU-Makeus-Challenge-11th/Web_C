const tmdbApiBaseUrl = (process.env.NEXT_PUBLIC_TMDB_API_BASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");
const tmdbAccessToken = (process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN ?? "").trim();

// import 시 예외를 던지면 React가 시작되기 전에 흰 화면이 됩니다.
export const tmdbConfigError =
  !tmdbApiBaseUrl || !tmdbAccessToken
    ? "NEXT_PUBLIC_TMDB_API_BASE_URL과 NEXT_PUBLIC_TMDB_ACCESS_TOKEN을 설정해 주세요."
    : null;

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
};
