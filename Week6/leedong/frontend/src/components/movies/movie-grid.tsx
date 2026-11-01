import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className="grid grid-cols-5 gap-x-[18px] gap-y-[21px]">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}