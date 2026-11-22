"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { movieDetailQueryOptions } from "../../api/movies/movie-queries";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { FavoriteButton } from "../../components/favorite-button"; // 미션 5: 북마크 버튼(로컬 저장) → 서버 즐겨찾기 버튼
import { RatingSection } from "../../components/rating-section"; // 미션 8: 내 평점 영역
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/tmdb-image";

// 9주차: 주소의 영화 id는 서버(app/movies/[movieId]/page.tsx)에서 읽어서 넘겨줌
export function MovieDetailPage({ movieIdParam }: { movieIdParam: string }) {
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery(movieDetailQueryOptions(movieId));

  return (
    <>
      {!isValidMovieId ? (
        <DetailMessage message="올바르지 않은 영화 번호예요." />
      ) : movieDetailQuery.isPending ? (
        <DetailMessage message="영화 정보를 불러오는 중이에요..." />
      ) : movieDetailQuery.isError ? (
        <DetailMessage
          message={getMovieDetailErrorMessage(movieDetailQuery.error)}
        />
      ) : (
        <MovieDetailContent movie={movieDetailQuery.data} />
      )}
    </>
  );
}

// 안내 화면 (로딩·오류·잘못된 번호일 때)
function DetailMessage({ message }: { message: string }) {
  return (
    <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-20">
      <h1 className="text-2xl font-bold">{message}</h1>
      <Link href="/" className="mt-6 inline-block font-semibold text-brand">
        영화 목록으로 돌아가기
      </Link>
    </main>
  );
}

// 영화 상세 화면
// 미션 8: 배치 변경
// 위: 배경 이미지 + 제목 / 아래: 왼쪽(포스터·소개·즐겨찾기) | 오른쪽(내 평점)
function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {
  const runtimeText =
    movie.runtime === null
      ? "상영 시간 정보 없음"
      : movie.runtime >= 60
        ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
        : `${movie.runtime}분`;

  const releaseDateText = movie.release_date.replaceAll("-", "."); // 2026-07-29 → 2026.07.29
  const genreText = movie.genres.map((genre) => genre.name).join(" · "); // SF · 액션 · 모험

  return (
    <main className="flex-1 bg-[#F6F7F9]">
      {/* 위: 배경 이미지 + 영화 목록 링크 + 제목 */}
      <section className="relative isolate overflow-hidden bg-gray-950 text-white">
        <img
          src={getTmdbBackdropUrl(movie.backdrop_path) ?? undefined}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10"
        />

        <div className="relative mx-auto flex min-h-[360px] w-[calc(100%-32px)] max-w-[1280px] flex-col justify-between py-8 sm:w-[calc(100%-48px)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
          >
            ‹ 영화 목록
          </Link>

          <div>
            <h1 className="text-3xl leading-tight font-bold tracking-[-0.04em] md:text-5xl">
              {movie.title}
            </h1>
            <p className="mt-3 text-sm text-white/80">{movie.original_title}</p>
            <p className="mt-2 flex flex-wrap gap-x-3 text-sm font-semibold">
              <span>{releaseDateText}</span>
              <span>{genreText}</span>
              <span>{runtimeText}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 아래: 왼쪽 영화 정보 | 오른쪽 내 평점 */}
      <section className="mx-auto flex w-[calc(100%-32px)] max-w-[1280px] flex-col gap-10 py-10 sm:w-[calc(100%-48px)] md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6 sm:flex-row sm:gap-8">
          <img
            src={getTmdbPosterUrl(movie.poster_path) ?? undefined}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-[200px] shrink-0 rounded-lg object-cover shadow-md"
          />

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#111111]">
              {movie.tagline || movie.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#6B7280]">{movie.overview}</p>
            <div className="mt-5">
              {/* 미션 5: 서버 즐겨찾기 버튼 */}
              <FavoriteButton movieId={movie.id} />
            </div>
          </div>
        </div>

        {/* 미션 8: 오른쪽 내 평점 영역 (왼쪽과 세로선으로 구분) */}
        <div className="w-full shrink-0 border-[#E3E5EA] md:w-[320px] md:border-l md:pl-8">
          <RatingSection movieId={movie.id} />
        </div>
      </section>
    </main>
  );
}
