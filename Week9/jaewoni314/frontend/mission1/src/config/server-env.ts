import "server-only";

// TMDB 토큰은 NEXT_PUBLIC_을 붙이지 않아 브라우저 번들에 들어가지 않아요.
// "server-only"를 import해서, 실수로 Client Component에서 이 파일을 불러오면 빌드가 실패하게 했어요.
const tmdbApiBaseUrl = process.env.TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수(TMDB_API_BASE_URL, TMDB_ACCESS_TOKEN)가 필요해요.");
}

export const serverEnv = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
};
