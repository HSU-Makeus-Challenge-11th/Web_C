import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { movieListQueryOptions } from "../../queries/movie-query-options";
import { toMovieCardData } from "../../adapters/movie-adapter";
import { MovieGrid } from "../../components/movieGrid";
import { Pagination } from "../../components/pagination";
import { RequestError } from "../../components/request-error";
import { MAX_TMDB_PAGE } from "../../utils/movies/movie-page";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  // 페이지별로 캐시를 구분하고, URL의 page가 바뀌면 해당 목록을 요청해요.
  const moviesQuery = useQuery(movieListQueryOptions({ page }));

  const movies = (moviesQuery.data?.results ?? []).map(toMovieCardData);
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, MAX_TMDB_PAGE);

  function handlePageChange(nextPage: number) {
    void navigate({ to: "/", search: nextPage === 1 ? {} : { page: nextPage } });
  }

  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-[1280px] flex-1 pt-6 pb-14 min-[641px]:w-[calc(100%-48px)]">
      <h1 className="mb-[18px] text-[26px] font-bold tracking-[-0.04em] min-[641px]:text-[32px]">
        영화 목록
      </h1>

      {/* 기존 UI에 Query의 로딩, 오류, 빈 결과, 성공 상태를 연결해요. */}
      {moviesQuery.isPending || (moviesQuery.isError && moviesQuery.isFetching) ? (
        <p role="status" className="py-20 text-center text-gray-500">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <div className="py-20 text-center">
          <RequestError
            message="영화 목록을 불러오지 못했어요."
            onRetry={() => { void moviesQuery.refetch(); }}
          />
        </div>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-gray-500">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  );
}
