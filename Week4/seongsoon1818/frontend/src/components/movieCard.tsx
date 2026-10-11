import { Link } from "@tanstack/react-router";
import type { Movie } from "../types/movie";
import { cn } from "../utils/cn";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({
  movie,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  const bookmarkLabel = isBookmarked
    ? `${movie.title} 북마크 해제`
    : `${movie.title} 북마크 추가`;

  return (
    <article className="min-w-0">
      <div className="relative aspect-[240/276] overflow-hidden rounded-lg bg-gray-200 min-[461px]:aspect-[2/3] min-[641px]:aspect-[240/276]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
          aria-label={`${movie.title} 상세 보기`}
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            loading="lazy"
            className="block size-full object-cover"
          />
        </Link>

        <button
          type="button"
          aria-label={bookmarkLabel}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute top-2.5 right-2.5 grid size-9 cursor-pointer place-items-center rounded-[7px] border p-1.5 text-white",
            "shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition-[background-color,transform] duration-150 hover:-translate-y-px",
            isBookmarked
              ? "border-brand bg-brand"
              : "border-white/90 bg-gray-900/80",
          )}
        >
          <img
            src={
              isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="size-6 invert"
          />
        </button>
      </div>

      <h2 className="mt-2.5 truncate text-sm leading-[1.45] font-bold tracking-[-0.03em] text-[#191d25]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h2>

      <p className="mt-0.5 text-xs leading-[1.4] text-[#9a9fa8]">
        {movie.releaseDate}
      </p>
    </article>
  );
}