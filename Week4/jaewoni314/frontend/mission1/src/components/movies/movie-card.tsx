import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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

        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-black/55 hover:bg-black/75",
            movie.isBookmarked ? "text-accent" : "text-white",
          )}
          aria-pressed={movie.isBookmarked}
          aria-label={
            movie.isBookmarked
              ? `${movie.title} 북마크 해제`
              : `${movie.title} 북마크 추가`
          }
          onClick={() => onToggleBookmark(movie.id)}
        >
          <span
            className={cn(
              "size-[22px]",
              movie.isBookmarked ? "icon icon--bookmark" : "icon icon--bookmark-outline",
            )}
            aria-hidden="true"
          />
        </button>
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
