import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button"; // 1. 북마크 버튼 불러오기
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let ignore = false;
    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isValidMovieId, parsedMovieId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isValidMovieId || isLoading || errorMessage || !movie) {
    const message = !isValidMovieId
      ? "올바르지 않은 영화 번호예요."
      : errorMessage ??
        (isLoading
          ? "영화 정보를 불러오는 중이에요..."
          : "영화 정보를 불러오지 못했어요.");
    return (
      <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-20">
        <h1 className="text-2xl font-bold">{message}</h1>
        <Link
          to="/"
          className="mt-6 inline-block font-semibold text-brand"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const runtimeText =
    movie.runtime === null
      ? "상영 시간 정보가 없어요."
      : movie.runtime >= 60
        ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
        : `${movie.runtime}분`;

  return (
    <main className="flex-1 bg-white">
      <section className="relative isolate overflow-hidden bg-gray-950 text-white">
        <img
          src={getTmdbBackdropUrl(movie.backdrop_path) ?? undefined}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40"
        />

        <div className="relative mx-auto w-[calc(100%-32px)] max-w-[1280px] py-10 sm:w-[calc(100%-48px)]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            ← 영화 목록
          </Link>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <img
              src={getTmdbPosterUrl(movie.poster_path) ?? undefined}
              alt={`${movie.title} 포스터`}
              className="aspect-[2/3] w-[240px] shrink-0 rounded-xl object-cover shadow-xl"
            />

            <div className="min-w-0">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl leading-tight font-bold tracking-[-0.04em] md:text-5xl">
                  {movie.title}
                </h1>
                {/* 2. 상세 화면 북마크 버튼 추가 */}
                <BookmarkButton movieId={movie.id} />
              </div>

              <p className="mt-3 text-lg text-white/70">
                {movie.original_title}
              </p>

              <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-white/60">개봉일</dt>
                  <dd className="mt-1">{movie.release_date}</dd>
                </div>

                <div>
                  <dt className="text-white/60">장르</dt>
                  <dd className="mt-1">
                    {movie.genres.map((genre) => genre.name).join(", ")}
                  </dd>
                </div>

                <div>
                  <dt className="text-white/60">상영 시간</dt>
                  <dd className="mt-1">{runtimeText}</dd>
                </div>
              </dl>

              <p className="mt-8 text-xl font-medium">
                {movie.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-32px)] max-w-[1280px] py-10 sm:w-[calc(100%-48px)]">
        <h2 className="text-2xl font-bold">줄거리</h2>
        <p className="mt-4 max-w-[900px] leading-8 text-gray-600">
          {movie.overview}
        </p>
      </section>
    </main>
  );
}