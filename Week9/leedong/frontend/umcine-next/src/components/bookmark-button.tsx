import { useFavoritesQuery } from "../hooks/use-favorites-query";
import { useToggleFavorite } from "../hooks/use-toggle-favorite";
import { BookmarkIconButton } from "./bookmark-icon-button";

interface BookmarkButtonProps {
  movieId: number;
}

// 영화 목록, 검색 결과처럼 카드가 많은 곳에서 써요.
// 카드마다 요청하지 않도록 내 즐겨찾기 목록 한 번으로 여부를 판단해요.
export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const favoritesQuery = useFavoritesQuery();
  const { toggleFavorite, isPending } = useToggleFavorite();

  const isFavorite =
    favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false;

  return (
    <BookmarkIconButton
      isBookmarked={isFavorite}
      disabled={isPending}
      onClick={() => toggleFavorite(movieId, isFavorite)}
    />
  );
}
