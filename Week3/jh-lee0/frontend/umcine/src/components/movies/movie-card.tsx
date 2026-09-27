import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex w-full min-w-0 flex-col gap-1">
      <div className="relative aspect-[240/274] w-full overflow-hidden rounded-lg bg-[#f6f7f9]">
        <img
          className="size-full object-cover"
          src={movie.posterPath}
          alt={movie.title}
        />

        <button
          className={`absolute top-2.5 right-2.5 z-10 flex size-[34px] cursor-pointer items-center justify-between rounded-lg border p-0 ${
            movie.isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "border-white bg-[#17191e]"
          }`}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label="북마크"
          type="button"
        >
          <img
            className="mx-auto size-6"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h3 className="truncate pt-1 text-sm font-extrabold text-[#17191e]">
        {movie.title}
      </h3>
      <p className="text-xs font-normal text-[#969da8]">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;