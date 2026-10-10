import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const label = isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      type="button"
      aria-label={`${movieTitle} ${label}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center",
        "rounded-lg border px-4 py-2 text-sm font-semibold",
        "transition-colors",
        isBookmarked
          ? "border-brand bg-brand text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        className,
      )}
    >
      {label}
    </button>
  );
}