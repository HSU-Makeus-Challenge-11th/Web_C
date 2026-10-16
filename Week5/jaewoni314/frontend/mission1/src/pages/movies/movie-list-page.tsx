import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { StatusMessage } from "../../components/movies/status-message";
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

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    // 페이지를 빠르게 바꾸면 이전 요청의 결과가 현재 화면을 덮어쓰지 않게 해요.
    return () => {
      ignore = true;
    };
  }, [currentPage]);

  function handleChangeCardSize(nextCardSize: CardSize) {
    setCardSize(nextCardSize);
    saveCardSize(nextCardSize);
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16 pt-12">
      <div className="mb-7 flex flex-wrap items-baseline gap-3">
        <h1 className="text-[32px] font-bold tracking-[-0.02em]">인기 영화</h1>

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

      {isLoading ? (
        <StatusMessage>영화 목록을 불러오는 중이에요.</StatusMessage>
      ) : errorMessage ? (
        <StatusMessage isError>{errorMessage}</StatusMessage>
      ) : (
        <MovieGrid movies={movies} cardSize={cardSize} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
