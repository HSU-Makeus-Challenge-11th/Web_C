import { useState } from "react";
import type { Movie } from "../../types/movie";
import { movies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [movieList, setMovieList] = useState<Movie[]>(movies);

  const handleToggleBookmark = (id: number) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <main className="flex-1 pt-8 pb-20">
      <div className="mx-auto w-full max-w-[1440px] px-20">
        <h2 className="mb-6 text-4xl font-extrabold tracking-[-1px]">
          영화 목록
        </h2>
        <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />
        <Pagination />
      </div>
    </main>
  );
}
