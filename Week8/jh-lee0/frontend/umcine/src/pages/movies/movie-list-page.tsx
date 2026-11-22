import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieListQueryOptions } from "../../api/movies/movie-queries";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery(movieListQueryOptions(page));

  const movies = moviesQuery.data?.results ?? [];

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="mx-auto flex w-[calc(100%-48px)] max-w-[1280px] flex-col gap-5 py-6">
      <h1 className="text-[38px] font-bold tracking-[-0.02em] text-gray-900">
        영화 목록
      </h1>

      {/* UI 상태에 따른 분기 처리 */}
      {moviesQuery.isPending ? (
        <p className="py-10 text-center text-gray-500">
          영화 목록을 불러오는 중이에요...
        </p>
      ) : moviesQuery.isError ? (
        <p className="py-10 text-center text-red-500">
          {moviesQuery.error.message}
        </p>
      ) : movies.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={page} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  );
}