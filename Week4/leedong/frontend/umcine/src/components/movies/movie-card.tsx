import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-1">
      <div className="relative h-[274px] overflow-hidden rounded-[10px] bg-[#f6f7f9]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <div className="absolute right-[10px] top-[10px]">
          <BookmarkButton movieId={movie.id} />
        </div>
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="pt-[5px] text-[14px] font-extrabold leading-[17px]">{movie.title}</h2>
      </Link>
      <p className="text-xs leading-[14px] text-[#969da8]">{movie.releaseDate}</p>
    </article>
  );
}