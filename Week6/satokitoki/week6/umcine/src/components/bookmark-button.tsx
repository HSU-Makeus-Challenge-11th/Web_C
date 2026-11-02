import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(movieId)}
      aria-pressed={isBookmarked}
      className={cn(
        "absolute top-[10px] right-[10px] rounded-md border-[1.5px] px-2 py-1 text-xs font-bold text-white",
        isBookmarked
          ? "border-[#1a66ff] bg-[#1a66ff]"
          : "border-white bg-gray-900/85",
      )}
    >
      {isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}
