import "server-only";
import { cacheLife } from "next/cache";
import { serverEnv } from "@/config/server-env";
import type { TmdbMovieDetail } from "./models";

// 영화 상세의 <title>과 Open Graph에 쓸 정보를 서버에서 TMDB로 직접 가져와요.
// 영화 제목과 줄거리는 자주 바뀌지 않아서 "use cache"로 결과를 저장해 두고, 같은 영화는 한 시간 동안 다시 요청하지 않아요.
export async function getMovieSummaryOnServer(movieId: number) {
  "use cache";
  cacheLife("hours");

  const response = await fetch(`${serverEnv.tmdbApiBaseUrl}/movie/${movieId}?language=ko-KR`, {
    headers: { Authorization: `Bearer ${serverEnv.tmdbAccessToken}` },
  });
  if (!response.ok) return null;

  const movie = (await response.json()) as TmdbMovieDetail;
  return { title: movie.title, overview: movie.overview, posterPath: movie.poster_path };
}
