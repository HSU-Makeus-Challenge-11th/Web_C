import { movies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  return (
    <main className="flex-1 pt-8 pb-20">
      <div className="mx-auto w-full max-w-[1440px] px-20">
        <h2 className="mb-6 text-4xl font-extrabold tracking-[-1px]">
          영화 목록
        </h2>
        <MovieGrid movies={movies} />
        <Pagination />
      </div>
    </main>
  );
}
