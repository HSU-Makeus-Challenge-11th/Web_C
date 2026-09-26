import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16 pt-12">
      <div className="mb-7 flex items-baseline gap-3">
        <h1 className="text-[32px] font-bold tracking-[-0.02em]">영화 목록</h1>
        <p className="text-[15px] text-muted">{movies.length}편</p>
      </div>

      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
