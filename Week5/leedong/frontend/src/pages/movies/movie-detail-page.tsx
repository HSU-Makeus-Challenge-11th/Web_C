import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function isValidMovieId(movieId: number) {
  return Number.isInteger(movieId) && movieId > 0;
}

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  return `${Math.floor(runtime / 60)}시간 ${runtime % 60}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId(parsedMovieId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- 5주차 노션 방식 (6주차 TanStack Query에서 대체)
    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId(parsedMovieId)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (!isValidMovieId(parsedMovieId)) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (errorMessage) {
    return <main>{errorMessage}</main>;
  }

  if (isLoading || !movie) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main>
      {backdropUrl ? (
        <img
          className="h-[300px] w-full object-cover"
          src={backdropUrl}
          alt=""
          aria-hidden="true"
        />
      ) : (
        <div className="flex h-[300px] w-full items-center justify-center bg-[#e3e6eb] text-xs font-bold text-[#606774]">
          이미지 없음
        </div>
      )}
      <Link to="/">영화 목록</Link>
      {posterUrl ? (
        <img
          className="h-[300px] w-[200px] object-cover"
          src={posterUrl}
          alt={`${movie.title} 포스터`}
        />
      ) : (
        <div className="flex h-[300px] w-[200px] items-center justify-center bg-[#e3e6eb] text-xs font-bold text-[#606774]">
          이미지 없음
        </div>
      )}
      <h1>{movie.title}</h1>
      <BookmarkButton movieId={movie.id} />
      <p>{movie.original_title}</p>
      <p>{movie.release_date}</p>
      <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
      <p>{formatRuntime(movie.runtime)}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
    </main>
  );
}