import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  // 평점 및 후기는 페이지 로컬 상태 유지
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  // Zustand 스토어에서 현재 영화의 북마크 상태 및 토글 함수 가져오기
  const isBookmarked = useBookmarkStore((state) =>
    movie ? state.bookmarkedMovieIds.includes(movie.id) : false,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!movie) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* 1. 상단 히어로(Backdrop) 영역 */}
      <section className="relative w-full h-[420px] md:h-[440px] bg-black overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        <div className="absolute inset-0 max-w-6xl mx-auto px-8 py-8 flex flex-col justify-between text-white">
          <div>
            <Link to="/" className="inline-flex gap-2 text-xs font-semibold">
              <span>&lt;</span> 영화 목록
            </Link>
          </div>

          <div className="mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
              {movie.title}
            </h1>
            <p className="text-sm text-gray-300 font-medium mb-1">
              {movie.originalTitle}
            </p>
            <p className="text-xs text-gray-400 font-medium">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-8 flex flex-col sm:flex-row gap-8 items-start">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-48 md:w-50 rounded-2xl mt-5"
          />

          <div className="pt-6 flex-1">
            {movie.tagline && (
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-snug">
                {movie.tagline}
              </h2>
            )}

            <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6 font-normal">
              {movie.overview}
            </p>

            {/* 북마크 버튼 (public/icon SVG 아이콘 적용) */}
            <button
              type="button"
              onClick={() => toggleBookmark(movie.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
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

          <button
            type="button"
            className="w-full py-3 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            평점 저장
          </button>
        </div>
      </section>
    </main>
  );
}
