import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { favoriteQueries } from "../../api/favorites/favorite-queries";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../hooks/favorites/use-favorite-mutations";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  movieTitle: string;
  // 영화 상세: 이 영화 하나의 여부를 묻는 GET /favorites/{movieId}를 써요.
  // 영화 카드: 카드마다 요청하지 않도록 GET /favorites 목록 한 번으로 확인해요.
  source: "status" | "list";
  showLabel?: boolean;
  className?: string;
}

// 6주차까지는 localStorage(Zustand)에 북마크를 저장했어요. 8주차부터는 서버의 즐겨찾기 API를 써요.
export function FavoriteButton({
  movieId,
  movieTitle,
  source,
  showLabel = false,
  className,
}: FavoriteButtonProps) {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));

  const statusQuery = useQuery({
    ...favoriteQueries.status(movieId),
    enabled: isLoggedIn && source === "status",
  });
  const listQuery = useQuery({
    ...favoriteQueries.list(),
    // 목록 전체가 아니라 "이 영화가 들어 있는지"만 골라 써요. 다른 영화가 바뀌어도 이 카드는 다시 그려지지 않아요.
    select: (favorites) => favorites.some((favorite) => favorite.movieId === movieId),
    enabled: isLoggedIn && source === "list",
  });
  const isFavorite = Boolean(source === "status" ? statusQuery.data?.isFavorite : listQuery.data);
  const isChecking = source === "status" ? statusQuery.isLoading : listQuery.isLoading;

  const addMutation = useAddFavoriteMutation();
  const removeMutation = useRemoveFavoriteMutation();
  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleClick = () => {
    if (!isLoggedIn) {
      alert("즐겨찾기는 로그인 후 사용할 수 있어요.");
      navigate({ to: "/login" });
      return;
    }
    if (isPending || isChecking) return;

    if (isFavorite) {
      removeMutation.mutate(movieId);
    } else {
      addMutation.mutate(movieId);
    }
  };

  const label = isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 disabled:opacity-60",
        isFavorite ? "text-accent" : "text-white",
        className,
      )}
      aria-pressed={isFavorite}
      aria-label={showLabel ? undefined : `${movieTitle} ${label}`}
      aria-busy={isPending || isChecking}
      disabled={isPending}
      onClick={handleClick}
    >
      <span
        className={cn(
          "size-[22px]",
          isFavorite ? "icon icon--bookmark" : "icon icon--bookmark-outline",
          isChecking && "animate-pulse",
        )}
        aria-hidden="true"
      />
      {showLabel && <span className="text-sm font-semibold">{isPending ? "저장 중" : label}</span>}
    </button>
  );
}
