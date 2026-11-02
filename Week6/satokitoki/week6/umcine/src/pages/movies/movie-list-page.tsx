import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="flex-1 pt-8 pb-20">
      <div className="mx-auto w-full max-w-[1440px] px-20">
        <h2 className="mb-6 text-4xl font-extrabold tracking-[-1px]">
          영화 목록
        </h2>

        {moviesQuery.isPending ? (
          <p className="py-20 text-center text-gray-500">
            영화 목록을 불러오는 중이에요.
          </p>
        ) : moviesQuery.isError ? (
          <p className="py-20 text-center text-red-500">
            {moviesQuery.error.message}
          </p>
        ) : movies.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            표시할 영화가 없어요.
          </p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
}
