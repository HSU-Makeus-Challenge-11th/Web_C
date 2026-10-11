import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="mx-auto flex w-[calc(100%-48px)] max-w-[1280px] flex-col gap-5 py-6">
      <h1 className="text-[38px] font-bold tracking-[-0.02em] text-gray-900">
        영화 목록
      </h1>

      {/* UI 상태에 따른 분기 처리 */}
      {isLoading ? (
        <p className="py-10 text-center text-gray-500">
          영화 목록을 불러오는 중이에요...
        </p>
      ) : errorMessage ? (
        <p className="py-10 text-center text-red-500">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <MovieGrid movies={movies} />
      )}

      <Pagination />
    </main>
  );
}