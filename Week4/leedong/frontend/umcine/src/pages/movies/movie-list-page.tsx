import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-5 px-20 pb-12 pt-6">
        <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px]">영화 목록</h1>
        <MovieGrid movies={movies} />
        <Pagination />
      </main>
      <footer className="flex h-[57px] items-center justify-end bg-white px-20 py-4 text-xs text-[#606774]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}