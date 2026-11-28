"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TmdbMovieDetail } from "../../api/movies/models";
import {
  getMovieDetail,
  getMovieDetailErrorMessage,
} from "../../api/movies/get-movie-detail";
import { useAuthStore } from "../../stores/auth-store";
import { getMe } from "../../api/members/me";
import { getFavoriteStatus } from "../../api/favorites/get-favorite-status";
import { useToggleFavoriteMutation } from "../../hooks/use-favorite-mutations";
import { getMemberRatings } from "../../api/ratings/get-member-ratings";
import { useRatingMutations } from "../../hooks/use-rating-mutations";

export function MovieDetailPage() {
  const params = useParams<{ movieId: string }>();
  const movieIdParam = params?.movieId;
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const memberId =
    (meQuery.data as { memberId?: number; id?: number } | undefined)
      ?.memberId ??
    (meQuery.data as { memberId?: number; id?: number } | undefined)?.id;

  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isValidMovieId && Boolean(accessToken),
    retry: false,
  });

  const toggleFavoriteMutation = useToggleFavoriteMutation(movieId);

  const memberRatingsQuery = useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(memberId),
  });

  const existingRating = memberRatingsQuery.data?.find(
    (item) => item.movieId === movieId,
  );

  const { createMutation, updateMutation, deleteMutation } =
    useRatingMutations(memberId);

  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [prevExistingRating, setPrevExistingRating] = useState(existingRating);

  if (existingRating !== prevExistingRating) {
    setPrevExistingRating(existingRating);
    setRating(existingRating ? existingRating.score : 0);
    setReview(existingRating ? (existingRating.comment ?? "") : "");
  }

  const movie: TmdbMovieDetail | null = movieDetailQuery.data ?? null;
  const isBookmarked = Boolean(favoriteStatusQuery.data);

  const handleToggleBookmark = () => {
    if (!accessToken) {
      alert("로그인이 필요한 기능이에요.");
      router.push("/login");
      return;
    }
    toggleFavoriteMutation.mutate(isBookmarked);
  };

  const handleSaveRating = () => {
    if (!accessToken) {
      alert("로그인이 필요한 기능이에요.");
      router.push("/login");
      return;
    }
    if (rating < 1) {
      alert("별점을 선택해 주세요.");
      return;
    }

    if (existingRating) {
      updateMutation.mutate({
        ratingId: existingRating.ratingId,
        body: { score: rating, comment: review.trim() || undefined },
      });
    } else {
      createMutation.mutate({
        movieId,
        score: rating,
        comment: review.trim() || undefined,
      });
    }
  };

  const handleDeleteRating = () => {
    if (!existingRating) return;
    deleteMutation.mutate(existingRating.ratingId);
  };

  if (!isValidMovieId) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="px-6 py-20 text-center text-gray-500">
        영화 정보를 불러오는 중입니다...
      </main>
    );
  }

  if (movieDetailQuery.isError || !movie) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-500">
        {movieDetailQuery.isError
          ? getMovieDetailErrorMessage(movieDetailQuery.error)
          : "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : "";

  const isRatingSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      <section className="relative w-full h-[420px] md:h-[440px] bg-black overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        <div className="absolute inset-0 max-w-6xl mx-auto px-8 py-8 flex flex-col justify-between text-white">
          <div>
            <Link href="/" className="inline-flex gap-2 text-xs font-semibold">
              <span>&lt;</span> 영화 목록
            </Link>
          </div>

          <div className="mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
              {movie.title}
            </h1>
            <p className="text-sm text-gray-300 font-medium mb-1">
              {movie.original_title}
            </p>
            <p className="text-xs text-gray-400 font-medium">
              {movie.release_date} ·{" "}
              {movie.genres.map((genre) => genre.name).join(" · ")} ·{" "}
              {movie.runtime != null ? `${movie.runtime}분` : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-8 flex flex-col sm:flex-row gap-8 items-start">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="w-48 md:w-50 rounded-2xl mt-5"
            />
          )}

          <div className="pt-6 flex-1">
            {movie.tagline && (
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-snug">
                {movie.tagline}
              </h2>
            )}

            <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6 font-normal">
              {movie.overview || "등록된 줄거리가 없습니다."}
            </p>

            <button
              type="button"
              disabled={toggleFavoriteMutation.isPending}
              onClick={handleToggleBookmark}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 ${
                isBookmarked
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-800 hover:bg-gray-900 text-white"
              }`}
            >
              <img
                src={
                  isBookmarked
                    ? "/icon/bookmark.svg"
                    : "/icon/bookmark-outline.svg"
                }
                alt={isBookmarked ? "북마크 해제" : "북마크 추가"}
                className="w-4 h-4"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              {isBookmarked ? "북마크 제거" : "북마크 추가"}
            </button>
          </div>
        </div>

        <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">내 평점</h3>
          <p className="text-xs text-gray-400 mb-4">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform active:scale-110"
              >
                <svg
                  className={`w-6 h-6 ${
                    star <= rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-200 fill-current"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            ))}
          </div>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            rows={4}
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-400 resize-none transition-all mb-4"
          />

          <div className="flex gap-2">
            <button
              type="button"
              disabled={isRatingSubmitting}
              onClick={handleSaveRating}
              className="flex-1 py-3 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {existingRating ? "평점 수정" : "평점 저장"}
            </button>

            {existingRating && (
              <button
                type="button"
                disabled={isRatingSubmitting}
                onClick={handleDeleteRating}
                className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
