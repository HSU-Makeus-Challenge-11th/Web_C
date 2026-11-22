"use client";

import Link from "next/link";
import type { MovieCardData } from "../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: MovieCardData;
}

export function MovieCard({
  movie,
}: MovieCardProps) {
  const posterUrl = movie.posterPath;

  return (
    <article className="min-w-0">
      <div className="relative aspect-[240/276] overflow-hidden rounded-lg bg-gray-200 min-[461px]:aspect-[2/3] min-[641px]:aspect-[240/276]">
        <Link
          href={`/movies/${movie.id}`}
          className="block h-full"
          aria-label={`${movie.title} 상세 보기`}
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              loading="lazy"
              className="block size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-sm text-gray-500">
              이미지 없음
            </span>
          )}
        </Link>

      </div>
      <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="mt-2" />

      <h2 className="mt-2.5 truncate text-sm leading-[1.45] font-bold tracking-[-0.03em] text-[#191d25]">
        <Link
          href={`/movies/${movie.id}`}
        >
          {movie.title}
        </Link>
      </h2>

      <p className="mt-0.5 text-xs leading-[1.4] text-[#9a9fa8]">
        {movie.releaseDate || "개봉일 정보 없음"}
      </p>
    </article>
  );
}
