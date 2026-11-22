const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const backendApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

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
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
};