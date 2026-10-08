import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-1">
      <div className="relative h-[274px] overflow-hidden rounded-[10px] bg-[#f6f7f9]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <button
          type="button"
          className={cn(
            "absolute right-[10px] top-[10px] flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white",
            movie.isBookmarked ? "bg-[#2563eb]" : "bg-[#17191e]",
            )}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="h-6 w-6 brightness-0 invert"
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="pt-[5px] text-[14px] font-extrabold leading-[17px]">{movie.title}</h2>
      </Link>
      <p className="text-xs leading-[14px] text-[#969da8]">{movie.releaseDate}</p>
    </article>
  );
}