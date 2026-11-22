import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import { getMovies, type GetMoviesRequest } from "../api/movies/get-movies";
import { searchMovies, type SearchMoviesRequest } from "../api/movies/search-movies";

// queryKey와 queryFn을 함께 정의해 화면마다 같은 요청 설정을 재사용해요.
// 반환 타입을 직접 지정하지 않아도 queryOptions가 응답 타입을 추론해요.
export function movieListQueryOptions({ page = 1 }: GetMoviesRequest = {}) {
  return queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
}

export function movieSearchQueryOptions({ query, page = 1 }: SearchMoviesRequest) {
  return queryOptions({
    queryKey: ["movies", "search", { query, page }],
    queryFn: () => searchMovies({ query, page }),
  });
}

export function movieDetailQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
  });
}
