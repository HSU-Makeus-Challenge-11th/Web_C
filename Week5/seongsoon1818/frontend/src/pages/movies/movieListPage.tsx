import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getMovies } from "../../api/movies/get-movies";
import { toMovieCardData } from "../../adapters/movie-adapter";
import type { MovieCardData } from "../../types/movie";
import { MovieGrid } from "../../components/movieGrid";
import { Pagination } from "../../components/pagination";
import { RequestError } from "../../components/request-error";
import { MAX_TMDB_PAGE } from "../../utils/movies/movie-page";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  function handlePageChange(nextPage: number) {
    void navigate({ to: "/", search: nextPage === 1 ? {} : { page: nextPage } });
  }

  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-[1280px] flex-1 pt-6 pb-14 min-[641px]:w-[calc(100%-48px)]">
      <h1 className="mb-[18px] text-[26px] font-bold tracking-[-0.04em] min-[641px]:text-[32px]">
        영화 목록
      </h1>
      <MovieListResults key={page} page={page} onPageChange={handlePageChange} />
    </main>
  );
}

// URL의 페이지가 바뀌면 key로 이전 요청 상태를 초기화합니다.
function MovieListResults({
  page,
  onPageChange,
}: {
  page: number;
  onPageChange: (page: number) => void;
}) {
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  function retry() {
    setErrorMessage(null);
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      try {
        const response = await getMovies({ page });
        if (!ignore) {
          setMovies(response.results.map(toMovieCardData));
          setTotalPages(Math.min(response.total_pages, MAX_TMDB_PAGE));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadMovies();
    return () => { ignore = true; };
  }, [page, retryCount]);

  if (isLoading) {
    return <p role="status" className="py-20 text-center text-gray-500">영화 목록을 불러오는 중이에요.</p>;
  }
  if (errorMessage) {
    return (
      <div className="py-20 text-center">
        <RequestError message={errorMessage} onRetry={retry} />
      </div>
    );
  }
  if (movies.length === 0) {
    return <p className="py-20 text-center text-gray-500">조건에 맞는 영화가 없어요.</p>;
  }

  return (
    <>
      <MovieGrid movies={movies} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
