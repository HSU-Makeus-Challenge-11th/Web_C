import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="py-20 text-center text-muted">표시할 영화가 없어요.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 md:gap-y-10 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />
      ))}
    </ul>
  );
}
