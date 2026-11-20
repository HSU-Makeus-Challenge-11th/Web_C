import Link from "next/link";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getGenreNames } from "../../utils/movies/genre-names";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { FavoriteButton } from "./favorite-button";
import { MovieImage } from "./movie-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <li>
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
        {/* <a>는 기본이 inline이라 높이가 없어요. 안의 이미지 영역(size-full)이 카드 높이를 채우도록 block으로 바꿔요. */}
        <Link href={`/movies/${movie.id}`} className="block size-full">
          <MovieImage
            className="size-full"
            sizes="(min-width: 1280px) 240px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <FavoriteButton
          movieId={movie.id}
          source="list"
          movieTitle={movie.title}
          className="absolute right-2 top-2 size-9 justify-center rounded-full bg-black/55 hover:bg-black/75"
        />
      </div>

      <div className="pt-3">
        <h3 className="truncate text-base font-semibold leading-[1.4]">
          <Link href={`/movies/${movie.id}`}>
            {movie.title}
          </Link>
        </h3>
        <p className="mt-1 flex flex-col gap-0.5 text-[13px] leading-[1.5] text-muted">
          <span>{movie.release_date || "개봉일 미정"}</span>
          <span>{getGenreNames(movie.genre_ids).join(", ")}</span>
        </p>
      </div>
    </li>
  );
}
