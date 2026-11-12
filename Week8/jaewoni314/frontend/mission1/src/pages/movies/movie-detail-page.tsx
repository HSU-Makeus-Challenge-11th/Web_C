import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { movieQueries } from "../../api/movies/movie-queries";
import { FavoriteButton } from "../../components/movies/favorite-button";
import { MovieImage } from "../../components/movies/movie-image";
import { StatusMessage } from "../../components/movies/status-message";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const movieDetailQuery = useQuery({
    ...movieQueries.detail(parsedMovieId),
    // 잘못된 영화 번호는 요청하지 않아요.
    enabled: isValidMovieId,
  });

  // 요청하지 않는 잘못된 번호에서도 isPending이 참이라서, 로딩보다 먼저 확인해요.
  if (!isValidMovieId) {
    return (
      <main className="mx-auto max-w-[1200px] px-6">
        <StatusMessage isError>올바르지 않은 영화 번호예요.</StatusMessage>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="mx-auto max-w-[1200px] px-6">
        <StatusMessage>영화 정보를 불러오는 중이에요.</StatusMessage>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="mx-auto max-w-[1200px] px-6">
        <StatusMessage isError>{getMovieDetailErrorMessage(movieDetailQuery.error)}</StatusMessage>
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const genreText = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main>
      <div className="relative">
        <MovieImage
          className="h-[320px] w-full sm:h-[420px]"
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          alt={`${movie.title} 배경 이미지`}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
      </div>

      <div className="relative z-10 mx-auto -mt-28 max-w-[1200px] px-6 pb-16">
        <Link to="/" className="text-sm font-medium text-muted hover:text-text">
          ← 영화 목록
        </Link>

        <div className="mt-4 flex flex-col gap-8 sm:flex-row">
          <MovieImage
            className="aspect-[2/3] w-[200px] shrink-0 rounded-xl shadow-lg"
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
            loading="eager"
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-bold tracking-[-0.02em]">{movie.title}</h1>
            <p className="text-[15px] text-muted">{movie.original_title}</p>
            <p className="text-[15px] text-muted">
              {[movie.release_date || "개봉일 미정", genreText, formatRuntime(movie.runtime)]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <FavoriteButton
              movieId={movie.id}
              source="status"
              movieTitle={movie.title}
              showLabel
              className="mt-3 self-start rounded-lg border border-line px-4 py-2 hover:bg-surface"
            />
            {movie.tagline && (
              <h2 className="mt-4 text-lg font-semibold text-accent">{movie.tagline}</h2>
            )}
            <p className="mt-1 max-w-[760px] leading-[1.7]">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
