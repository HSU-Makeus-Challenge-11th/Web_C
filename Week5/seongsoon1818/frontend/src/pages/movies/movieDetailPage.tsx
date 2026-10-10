import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { RequestError } from "../../components/request-error";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
    return <DetailMessage message="올바르지 않은 영화 번호예요." isError />;
  }

  return <MovieDetailContent key={parsedMovieId} movieId={parsedMovieId} />;
}

function DetailMessage({
  message,
  isError = false,
  onRetry,
}: {
  message: string;
  isError?: boolean;
  onRetry?: () => void;
}) {
  return (
    <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-20">
      {onRetry ? (
        <RequestError message={message} onRetry={onRetry} />
      ) : (
        <p role={isError ? "alert" : "status"} className="text-xl font-semibold">{message}</p>
      )}
      <Link to="/" className="mt-6 inline-block font-semibold text-brand">영화 목록으로 돌아가기</Link>
    </main>
  );
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [retryCount, setRetryCount] = useState(0);

  function retry() {
    setErrorMessage(null);
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      try {
        const response = await getMovieDetail(movieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadMovie();
    return () => { ignore = true; };
  }, [movieId, retryCount]);

  if (isLoading) return <DetailMessage message="영화 정보를 불러오는 중이에요." />;
  if (errorMessage) return <DetailMessage message={errorMessage} isError onRetry={retry} />;
  if (!movie) return <DetailMessage message="영화를 찾을 수 없어요." isError />;

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const runtime = movie.runtime === null
    ? "상영 시간 정보가 없어요."
    : movie.runtime >= 60
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : `${movie.runtime}분`;

  return (
    <main className="flex-1 bg-white">
      <section className="relative isolate overflow-hidden bg-gray-950 text-white">
        {backdropUrl ? (
          <img src={backdropUrl} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-gray-800 p-4 text-right text-sm text-gray-400">이미지 없음</div>
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40" />

        <div className="relative mx-auto w-[calc(100%-32px)] max-w-[1280px] py-10 sm:w-[calc(100%-48px)]">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">← 영화 목록</Link>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <div className="flex aspect-[2/3] w-[240px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-700 text-gray-300 shadow-xl">
              {posterUrl ? (
                <img src={posterUrl} alt={`${movie.title} 포스터`} className="size-full object-cover" />
              ) : "이미지 없음"}
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl leading-tight font-bold tracking-[-0.04em] md:text-5xl">{movie.title}</h1>
              <p className="mt-3 text-lg text-white/70">{movie.original_title}</p>
              <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-white/60">개봉일</dt>
                  <dd className="mt-1">{movie.release_date || "정보 없음"}</dd>
                </div>
                <div>
                  <dt className="text-white/60">장르</dt>
                  <dd className="mt-1">{movie.genres.map((genre) => genre.name).join(" · ") || "정보 없음"}</dd>
                </div>
                <div>
                  <dt className="text-white/60">상영 시간</dt>
                  <dd className="mt-1">{runtime}</dd>
                </div>
              </dl>
              {movie.tagline && <p className="mt-8 text-xl font-medium">{movie.tagline}</p>}
              <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="mt-6" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto w-[calc(100%-32px)] max-w-[1280px] py-10 sm:w-[calc(100%-48px)]">
        <h2 className="text-2xl font-bold">줄거리</h2>
        <p className="mt-4 max-w-[900px] leading-8 text-gray-600">{movie.overview || "줄거리 정보가 없어요."}</p>
      </section>
    </main>
  );
}
