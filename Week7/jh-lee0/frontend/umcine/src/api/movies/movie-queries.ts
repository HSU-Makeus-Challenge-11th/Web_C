import { queryOptions } from "@tanstack/react-query";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";
import { getMovieDetail } from "./get-movie-detail";

// 영화 목록
export function movieListQueryOptions(page: number) {
  return queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
}

// 영화 검색
export function movieSearchQueryOptions(query: string) {
  return queryOptions({
    queryKey: ["movies", "search", { query }],
    queryFn: () => searchMovies({ query }),
    enabled: query.length > 0,
  });
}

// 영화 상세
export function movieDetailQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: Number.isInteger(movieId) && movieId > 0,
    staleTime: 30 * 1000,
  });
}