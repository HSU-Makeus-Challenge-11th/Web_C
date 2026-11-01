import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "./get-movie-detail";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

// 상세 정보는 전역 기본값(1분)보다 짧게, 30초 동안만 최신으로 취급해요.
const MOVIE_DETAIL_STALE_TIME = 30 * 1000;

// 영화 query의 key와 요청 함수를 한곳에 모아, 화면마다 key를 다르게 적는 실수를 막아요.
// 모든 key가 "movies"로 시작해서 개발자 도구에서 영화 캐시를 한눈에 찾을 수 있어요.
const movieQueries = {
  all: () => ["movies"] as const,
  list: (page: number) =>
    queryOptions({
      queryKey: [...movieQueries.all(), "list", { page }],
      queryFn: () => getMovies({ page }),
    }),
  search: (query: string) =>
    queryOptions({
      queryKey: [...movieQueries.all(), "search", { query }],
      queryFn: () => searchMovies({ query }),
    }),
  detail: (movieId: number) =>
    queryOptions({
      queryKey: [...movieQueries.all(), "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: MOVIE_DETAIL_STALE_TIME,
    }),
};

export { movieQueries };
