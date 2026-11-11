import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  // Zustand 스토어에서 현재 영화 ID가 북마크되어 있는지 판단
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <button
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 text-white transition-colors",
            isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          aria-pressed={isBookmarked}
          onClick={() => toggleBookmark(movie.id)}
        >
          <img
            src={
              isBookmarked ? "/icon/bookmark.svg" : "/icon/bookmark-outline.svg"
            }
            alt={isBookmarked ? "북마크 해제" : "북마크 추가"}
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </button>
      </div>
      <div className="mt-2.5 flex flex-col gap-0.5">
        <p className="line-clamp-1 text-xs font-bold text-gray-900">
          {movie.title}
        </p>
        <p className="text-[11px] font-medium text-gray-400">
          {movie.releaseDate}
        </p>
      </div>
    </article>
  );
}
