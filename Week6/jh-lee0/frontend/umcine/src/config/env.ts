const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const backendApiBaseUrl = import.meta.env.VITE_BACKEND_API_BASE_URL;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요합니다.");
}

if (!backendApiBaseUrl) {
  throw new Error("백엔드 환경 변수가 필요합니다.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  backendApiBaseUrl,
};