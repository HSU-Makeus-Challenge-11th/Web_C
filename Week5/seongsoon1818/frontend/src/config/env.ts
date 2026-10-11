const tmdbApiBaseUrl = (import.meta.env.VITE_TMDB_API_BASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");
const tmdbAccessToken = (import.meta.env.VITE_TMDB_ACCESS_TOKEN ?? "").trim();

// import 시 예외를 던지면 React가 시작되기 전에 흰 화면이 됩니다.
export const tmdbConfigError =
  !tmdbApiBaseUrl || !tmdbAccessToken
    ? "VITE_TMDB_API_BASE_URL과 VITE_TMDB_ACCESS_TOKEN을 설정해 주세요."
    : null;

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
};
