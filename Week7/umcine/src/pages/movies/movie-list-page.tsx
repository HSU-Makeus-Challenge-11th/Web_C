import Moviegrid from "../../components/movies/movie-grid";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies: Movie[] = (moviesQuery.data?.results ?? []).map(
    (movie: TmdbMovieListItem) => ({
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path ?? "",
      backdropPath: movie.backdrop_path ?? "",
      genres: [],
      runtime: "",
      tagline: "",
      overview: movie.overview,
      isBookmarked: false,
    }),
  );

  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">영화 목록</h2>

      {moviesQuery.isPending ? (
        <p className="text-gray-500 py-12 text-center text-base">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="text-red-500 py-12 text-center text-base font-medium">
          영화 목록을 불러오지 못했어요.
        </p>
      ) : movies.length === 0 ? (
        <p className="text-gray-500 py-12 text-center text-base">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <>
          <Moviegrid movies={movies} />

          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const startPage = Math.min(
                Math.max(1, page - 2),
                Math.max(1, totalPages - 4),
              );
              const pageNumber = startPage + index;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    page === pageNumber
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </>
      )}
    </main>
  );
}
