import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(Number(movieId)),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <main className="flex-1 px-20 py-32 text-center text-lg text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="flex-1 pb-20">
      {/* 히어로: 배경 이미지 + 제목 */}
      <section className="relative h-[360px] overflow-hidden bg-gray-900 text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
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
            <p className="mt-3 text-[15px]">{movie.originalTitle}</p>
            <p className="mt-2 flex gap-3 text-sm font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 아래: 포스터 / 소개 / 내 평점 */}
      <div className="mx-auto mt-6 flex w-full max-w-[1440px] gap-8 px-20">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-[200/287] w-[200px] shrink-0 rounded-lg object-cover shadow-xl"
        />

        <div className="flex-1 pt-1">
          <h2 className="text-[22px] font-bold tracking-[-0.5px]">
            {movie.tagline}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {movie.overview}
          </p>
          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            aria-pressed={isBookmarked}
            className={cn(
              "mt-5 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold",
              isBookmarked
                ? "bg-[#1a66ff] text-white"
                : "border border-[#1a66ff] bg-white text-[#1a66ff]",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className={cn("size-4", isBookmarked && "brightness-0 invert")}
            />
            즐겨찾기
          </button>
        </div>

        <aside className="w-[376px] shrink-0 border-l border-gray-200 pl-8">
          <h2 className="text-xl font-bold">내 평점</h2>
          <p className="mt-1 text-xs text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setRating(score)}
                aria-label={`${score}점`}
                className={cn(
                  "flex size-10 items-center justify-center rounded-md border bg-white",
                  score <= rating ? "border-gray-900" : "border-gray-200",
                )}
              >
                <img
                  src={
                    score <= rating
                      ? "/icons/star.svg"
                      : "/icons/star-outline.svg"
                  }
                  alt=""
                  className="size-5"
                />
              </button>
            ))}
          </div>

          <textarea
            name="review"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-[105px] w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none placeholder:text-gray-400 focus:border-gray-900"
          />

          <button
            type="button"
            disabled={rating === 0}
            className="mt-2 h-[42px] w-full rounded-md bg-gray-900 text-sm font-bold text-white disabled:opacity-40"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}
