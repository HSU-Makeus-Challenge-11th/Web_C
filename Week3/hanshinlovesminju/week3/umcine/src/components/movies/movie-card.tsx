import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article>
      <div className="relative aspect-[275/313] overflow-hidden rounded-lg bg-gray-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover"
          />
        </Link>
        <button
          type="button"
          className={cn(
            "absolute top-[10px] right-[10px] flex size-8 items-center justify-center rounded-md border-[1.5px]",
            movie.isBookmarked
              ? "border-[#1a66ff] bg-[#1a66ff]"
              : "border-white bg-gray-900/85",
          )}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={movie.isBookmarked}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="size-5 brightness-0 invert"
          />
        </button>
      </div>
      <h3 className="mt-3 text-[15px] font-bold">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p className="mt-1 text-[13px] text-gray-400">{movie.releaseDate}</p>
    </article>
  );
}
