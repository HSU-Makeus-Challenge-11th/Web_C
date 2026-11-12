import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { favoriteQueries } from "../../api/favorites/favorite-queries";
import { movieQueries } from "../../api/movies/movie-queries";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { FavoriteButton } from "../movies/favorite-button";
import { MovieImage } from "../movies/movie-image";

// 마이페이지의 "내 즐겨찾기" (GET /favorites)
export function FavoriteMovieList() {
  const favoritesQuery = useQuery(favoriteQueries.list());
  const favorites = favoritesQuery.data ?? [];

  // 즐겨찾기에는 TMDB 영화 ID만 있어서, 제목과 포스터는 영화 상세 API로 가져와요.
  // 영화 상세 화면과 같은 key라서 이미 본 영화는 다시 요청하지 않아요.
  const movieDetailQueries = useQueries({
    queries: favorites.map((favorite) => movieQueries.detail(favorite.movieId)),
  });

  return (
    <section className="mt-10" aria-labelledby="favorites-title">
      <h2 id="favorites-title" className="text-xl font-bold">
        내 즐겨찾기 <span className="text-muted">{favoritesQuery.isSuccess ? favorites.length : ""}</span>
      </h2>

      {favoritesQuery.isPending && <p className="mt-4 text-sm text-muted">즐겨찾기를 불러오는 중이에요.</p>}
      {favoritesQuery.isError && (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {getApiErrorMessage(favoritesQuery.error, "즐겨찾기를 불러오지 못했어요.")}
        </p>
      )}
      {favoritesQuery.isSuccess && favorites.length === 0 && (
        <p className="mt-4 rounded-xl border border-line px-6 py-8 text-center text-sm text-muted">
          아직 즐겨찾기한 영화가 없어요.{" "}
          <Link to="/" className="font-semibold text-accent hover:underline">
            영화 둘러보기
          </Link>
        </p>
      )}

      {favorites.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
          {favorites.map((favorite, index) => {
            const movie = movieDetailQueries[index]?.data;
            const title = movie?.title ?? `영화 #${favorite.movieId}`;
            return (
              <li key={favorite.favoriteId}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
                  <Link to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }}>
                    <MovieImage
                      className="size-full"
                      src={movie ? getTmdbPosterUrl(movie.poster_path) : null}
                      alt={`${title} 포스터`}
                    />
                  </Link>
                  <FavoriteButton
                    movieId={favorite.movieId}
                    source="list"
                    movieTitle={title}
                    className="absolute right-2 top-2 size-9 justify-center rounded-full bg-black/55 hover:bg-black/75"
                  />
                </div>
                <p className="mt-2 truncate text-sm font-semibold">{title}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
