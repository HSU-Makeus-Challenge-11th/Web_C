import { useFavoriteStatusQuery } from "../hooks/use-favorite-status-query";
import { useMemberId } from "../hooks/use-member-id";
import { useToggleFavorite } from "../hooks/use-toggle-favorite";
import { BookmarkIconButton } from "./bookmark-icon-button";

interface FavoriteButtonProps {
  movieId: number;
}

// 영화 상세 화면에서 써요. 이 영화 하나의 즐겨찾기 여부를 서버에 물어봐요.
export function FavoriteButton({ movieId }: FavoriteButtonProps) {
  const memberId = useMemberId();
  const statusQuery = useFavoriteStatusQuery(movieId);
  const { toggleFavorite, isPending } = useToggleFavorite();

  const isFavorite = statusQuery.data ?? false;
  const isLoadingStatus = memberId !== undefined && statusQuery.isPending;

  return (
    <BookmarkIconButton
      isBookmarked={isFavorite}
      disabled={isPending || isLoadingStatus}
      onClick={() => toggleFavorite(movieId, isFavorite)}
    />
  );
}
