import type { MovieCardData } from "../types/movie";
import { useBookmarkStore } from "../stores/bookmark-store";
import { MovieCard } from "./movieCard";

export function MovieGrid({ movies }: { movies: MovieCardData[] }) {
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <section
      id="movies"
      aria-label="영화 목록"
      className="grid grid-cols-1 gap-x-3.5 gap-y-6 min-[461px]:grid-cols-2 min-[641px]:gap-x-5 min-[641px]:gap-y-7 min-[721px]:grid-cols-3 min-[1025px]:grid-cols-5"
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedMovieIds.includes(movie.id)}
          onToggleBookmark={toggleBookmark}
        />
      ))}
    </section>
  );
}
