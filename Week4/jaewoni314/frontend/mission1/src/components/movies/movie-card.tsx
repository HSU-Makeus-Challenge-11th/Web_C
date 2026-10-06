import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <li>
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="size-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            loading="lazy"
          />
        </Link>

        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute right-2 top-2 size-9 justify-center rounded-full bg-black/55 hover:bg-black/75"
        />
      </div>

      <div className="pt-3">
        <h3 className="truncate text-base font-semibold leading-[1.4]">
          <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
            {movie.title}
          </Link>
        </h3>
        <p className="mt-1 flex flex-col gap-0.5 text-[13px] leading-[1.5] text-muted">
          <span>{movie.releaseDate}</span>
          <span>{movie.genres.join(", ")}</span>
        </p>
      </div>
    </li>
  );
}
