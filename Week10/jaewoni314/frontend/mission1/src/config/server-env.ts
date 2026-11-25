import "server-only";

// TMDB 토큰은 NEXT_PUBLIC_을 붙이지 않아 브라우저 번들에 들어가지 않아요.
// "server-only"를 import해서, 실수로 Client Component에서 이 파일을 불러오면 빌드가 실패하게 했어요.
const tmdbApiBaseUrl = process.env.TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.TMDB_ACCESS_TOKEN;

// 10주차: Vercel 빌드 로그에서 어떤 변수가 빠졌는지 바로 알 수 있도록, 값은 빼고 비어 있는 변수 이름만 알려 줘요.
const missing = [
  ["TMDB_API_BASE_URL", tmdbApiBaseUrl],
  ["TMDB_ACCESS_TOKEN", tmdbAccessToken],
].flatMap(([name, value]) => (value ? [] : [name]));

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error(`TMDB 환경 변수가 필요해요. 비어 있는 변수: ${missing.join(", ")}`);
}

export const serverEnv = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
};
