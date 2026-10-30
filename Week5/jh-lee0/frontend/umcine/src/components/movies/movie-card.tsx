import { Link } from "@tanstack/react-router"; 
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store"; // Zustand 스토어 불러오기

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

function MovieCard({ movie }: MovieCardProps) {
  // 1. Zustand 스토어에서 이 영화가 북마크되었는지 확인 (Selector)
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id)
  );

  // 2. Zustand 스토어에서 토글 함수 가져오기 (Selector)
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <article className="flex w-full min-w-0 flex-col gap-1">
      <div className="relative aspect-[240/274] w-full overflow-hidden rounded-lg bg-[#f6f7f9]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block size-full"
>
          <img
            className="size-full object-cover"
            src={
              movie.poster_path
               ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : undefined
           }
            alt={movie.title}
         />
        </Link>

        {/* 3. Zustand 스토어 상태(isBookmarked, toggleBookmark)로 버튼 제어 */}
        <button
          className={`absolute top-2.5 right-2.5 z-10 flex size-[34px] cursor-pointer items-center justify-between rounded-lg border p-0 ${
            isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "border-white bg-[#17191e]"
          }`}
          onClick={() => toggleBookmark(movie.id)}
          aria-label="북마크"
          type="button"
        >
          <img
            className="mx-auto size-6"
            src={
              isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="truncate pt-1 text-sm font-extrabold text-[#17191e]">
          {movie.title}
       </h3>
      </Link>
      <p className="text-xs font-normal text-[#969da8]">{movie.release_date}</p>
    </article>
  );
}

export default MovieCard;