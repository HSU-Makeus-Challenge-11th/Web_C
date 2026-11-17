import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { getMemberRatings } from "../../api/ratings/get-member-ratings";
import { RatingPanel } from "../../components/movies/rating-panel";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getFavoriteStatus } from "../../api/favorites/get-favorite-status";
import { useToggleFavoriteMutation } from "../../hooks/use-toggle-favorite-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000, // 상세 화면만 30초
  });

  // 즐겨찾기 여부는 로그인한 경우에만 조회합니다
  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isValidMovieId && Boolean(accessToken),
    retry: false,
  });
  // 내 정보에서 memberId를 얻고, 그 회원의 평점 목록에서 이 영화의 평점을 찾습니다
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const memberId = meQuery.data?.memberId;

  const ratingsQuery = useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== undefined,
  });
  const myRating = ratingsQuery.data?.find(
    (rating) => rating.movieId === movieId,
  );

  const toggleFavoriteMutation = useToggleFavoriteMutation(movieId);
  const isFavorite = favoriteStatusQuery.data?.isFavorite ?? false;

  const handleClickFavorite = () => {
    // 로그인하지 않았다면 로그인 화면으로 보냅니다
    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }
    if (toggleFavoriteMutation.isPending) return;
    toggleFavoriteMutation.mutate(isFavorite);
  };

  if (!isValidMovieId) {
    return (
      <main className="flex-1 px-20 py-32 text-center text-lg text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="flex-1 px-20 py-32 text-center text-lg text-gray-500">
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="flex-1 px-20 py-32 text-center text-lg text-gray-500">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main className="flex-1 pb-20">
      {/* 히어로: 배경 이미지 + 제목 */}
      <section className="relative h-[360px] overflow-hidden bg-gray-900 text-white">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/30" />

        <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col px-20 pt-8 pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 self-start text-sm font-bold"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="size-4 brightness-0 invert"
            />
            영화 목록
          </Link>

          <div className="mt-auto">
            <h1 className="text-5xl font-extrabold tracking-[-1px]">
              {movie.title}
            </h1>
            <p className="mt-3 text-[15px]">{movie.original_title}</p>
            <p className="mt-2 flex gap-3 text-sm font-bold">
              <span>{movie.release_date}</span>
              <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 아래: 포스터 / 소개 / 내 평점 */}
      <div className="mx-auto mt-6 flex w-full max-w-[1440px] gap-8 px-20">
        <div className="aspect-[200/287] w-[200px] shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-xl">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </div>

        <div className="flex-1 pt-1">
          <h2 className="text-[22px] font-bold tracking-[-0.5px]">
            {movie.tagline}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {movie.overview}
          </p>
          <button
            type="button"
            onClick={handleClickFavorite}
            disabled={toggleFavoriteMutation.isPending}
            aria-pressed={isFavorite}
            className={cn(
              "mt-5 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold disabled:opacity-60",
              isFavorite
                ? "bg-[#1a66ff] text-white"
                : "border border-[#1a66ff] bg-white text-[#1a66ff]",
            )}
          >
            <img
              src={
                isFavorite
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className={cn("size-4", isFavorite && "brightness-0 invert")}
            />
            {toggleFavoriteMutation.isPending ? "변경 중" : "즐겨찾기"}
          </button>
        </div>

        <RatingPanel
          key={myRating?.ratingId ?? "new"}
          movieId={movieId}
          myRating={myRating}
          isLoggedIn={Boolean(accessToken)}
        />
      </div>
    </main>
  );
}
