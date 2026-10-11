import { useState } from "react";
import { MovieGrid } from "../../components/movieGrid";
import { Pagination } from "../../components/pagination";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

const PAGE_SIZE = 10;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

    const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const totalPages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleMovies = movies.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-[1280px] flex-1 pt-6 pb-14 min-[641px]:w-[calc(100%-48px)]">
      <h1 className="mb-[18px] text-[26px] leading-tight font-bold tracking-[-0.04em] min-[641px]:text-[32px]">
        영화 목록
      </h1>

      <MovieGrid
        movies={visibleMovies}
        bookmarkedMovieIds={new Set(bookmarkedMovieIds)}
        onToggleBookmark={toggleBookmark}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}