import Image from "next/image";
import Link from "next/link";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="flex flex-col gap-1">
      <div className="relative h-[274px] overflow-hidden rounded-[10px] bg-[#f6f7f9]">
        <Link href={`/movies/${movie.id}`}>
          {posterUrl ? (
            <Image
              className="object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              fill
              sizes="(max-width: 768px) 50vw, 200px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#e3e6eb] text-xs font-bold text-[#606774]">
              이미지 없음
            </div>
          )}
        </Link>
        <div className="absolute right-[10px] top-[10px]">
          <BookmarkButton movieId={movie.id} />
        </div>
      </div>
      <Link href={`/movies/${movie.id}`}>
        <h2 className="pt-[5px] text-[14px] font-extrabold leading-[17px]">{movie.title}</h2>
      </Link>
      <p className="text-xs leading-[14px] text-[#969da8]">{movie.release_date}</p>
    </article>
  );
}