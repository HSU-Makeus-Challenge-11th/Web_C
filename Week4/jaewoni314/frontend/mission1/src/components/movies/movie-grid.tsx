import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import type { CardSize } from "../../utils/view-setting-storage";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  cardSize?: CardSize;
}

const gridClassBySize: Record<CardSize, string> = {
  large:
    "grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 md:gap-y-10 xl:grid-cols-5",
  small:
    "grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-x-4 md:gap-y-8 xl:grid-cols-7",
};

export function MovieGrid({ movies, cardSize = "large" }: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="py-20 text-center text-muted">표시할 영화가 없어요.</p>;
  }

  return (
    <ul className={cn("grid", gridClassBySize[cardSize])}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}
