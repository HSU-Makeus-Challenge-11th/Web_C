import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  showLabel?: boolean;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  showLabel = false,
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const label = isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5",
        isBookmarked ? "text-accent" : "text-white",
        className,
      )}
      aria-pressed={isBookmarked}
      aria-label={showLabel ? undefined : `${movieTitle} ${label}`}
      onClick={() => toggleBookmark(movieId)}
    >
      <span
        className={cn(
          "size-[22px]",
          isBookmarked ? "icon icon--bookmark" : "icon icon--bookmark-outline",
        )}
        aria-hidden="true"
      />
      {showLabel && <span className="text-sm font-semibold">{label}</span>}
    </button>
  );
}
