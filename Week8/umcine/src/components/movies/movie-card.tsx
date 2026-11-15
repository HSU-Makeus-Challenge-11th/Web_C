import type { Movie } from "../../types/movie";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../../utils/cn";
import { useAuthStore } from "../../stores/auth-store";
import { getFavorites } from "../../api/favorites/get-favorites";
import { useToggleFavoriteMutation } from "../../hooks/use-favorite-mutations";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 로그인 상태일 때만 내 즐겨찾기 목록 조회 (TanStack Query가 캐싱하므로 카드가 많아도 API는 1번만 호출됨)
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    staleTime: 60 * 1000,
    retry: false,
  });

  const isBookmarked = Boolean(
    favoritesQuery.data?.some((item) => item.movieId === movie.id),
  );

  const toggleFavoriteMutation = useToggleFavoriteMutation(movie.id);

  const handleToggleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken) {
      alert("로그인이 필요한 기능이에요.");
      navigate({ to: "/login" });
      return;
    }

    toggleFavoriteMutation.mutate(isBookmarked);
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          <img
            src={
              movie.posterPath
                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                : "/no-image.png"
            }
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          disabled={toggleFavoriteMutation.isPending}
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 text-white transition-colors disabled:opacity-50",
            isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          aria-pressed={isBookmarked}
          onClick={handleToggleBookmark}
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
