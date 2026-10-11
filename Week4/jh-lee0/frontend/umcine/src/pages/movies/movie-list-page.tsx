import { movies as initialMovies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  return (
    <main className="mx-auto flex w-[calc(100%-48px)] max-w-[1280px] flex-col gap-5 py-6">
      <h1 className="text-[38px] font-bold tracking-[-0.02em] text-gray-900">
        영화 목록
      </h1>
      <MovieGrid movies={initialMovies} />
      <Pagination />
    </main>
  );
}