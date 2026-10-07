import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import {
  CARD_SIZES,
  readCardSize,
  saveCardSize,
  type CardSize,
} from "../../utils/view-setting-storage";

const TOTAL_PAGES = 5;

const cardSizeLabels: Record<CardSize, string> = {
  large: "크게",
  small: "작게",
};

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  // 초기값 함수로 넘겨 첫 렌더링에서 한 번만 저장값을 읽어요.
  const [cardSize, setCardSize] = useState(readCardSize);

  function handleChangeCardSize(nextCardSize: CardSize) {
    setCardSize(nextCardSize);
    saveCardSize(nextCardSize);
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16 pt-12">
      <div className="mb-7 flex flex-wrap items-baseline gap-3">
        <h1 className="text-[32px] font-bold tracking-[-0.02em]">영화 목록</h1>
        <p className="text-[15px] text-muted">{movies.length}편</p>

        <div
          className="ml-auto flex rounded-lg border border-line p-1"
          role="group"
          aria-label="카드 크기"
        >
          {CARD_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={cn(
                "rounded-md px-3 py-1 text-sm",
                size === cardSize
                  ? "bg-surface font-semibold text-text"
                  : "text-muted hover:text-text",
              )}
              aria-pressed={size === cardSize}
              onClick={() => handleChangeCardSize(size)}
            >
              {cardSizeLabels[size]}
            </button>
          ))}
        </div>
      </div>

      <MovieGrid movies={movies} cardSize={cardSize} />

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
