import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  // 1. Selector: 스토어에서 '현재 영화가 북마크되었는지 여부(boolean)'만 쏙 골라옴
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  // 2. Selector: 스토어에서 '북마크 토글 함수(toggleBookmark)'만 쏙 골라옴
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button type="button" onClick={() => toggleBookmark(movieId)}>
      {isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}