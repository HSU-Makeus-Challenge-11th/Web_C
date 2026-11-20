"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { movieQueries } from "../../api/movies/movie-queries";
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

// TMDB API는 500페이지까지만 요청할 수 있어서, 응답의 total_pages가 더 커도 500페이지까지만 이동해요.
const MAX_TMDB_PAGE = 500;

const cardSizeLabels: Record<CardSize, string> = {
  large: "크게",
  small: "작게",
};

// 1 이상의 정수가 아닌 page 값은 무시하고 1페이지를 보여 줘요. (8주차 routes/index.tsx의 validateSearch)
function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function MovieListPage() {
  // 페이지 번호를 URL에 두어 상세 화면에서 돌아오거나 새로고침해도 보던 페이지를 유지해요.
  // useSearchParams는 문자열만 돌려줘서, TanStack Router의 validateSearch가 하던 숫자 검사를 직접 해요.
  const searchParams = useSearchParams();
  const currentPage = parsePage(searchParams.get("page"));
  const router = useRouter();
  const pathname = usePathname();
  // 서버에는 localStorage가 없어서, 초기값 함수에서 저장값을 읽으면 서버 렌더링 중에 오류가 나요.
  // 서버와 브라우저의 첫 화면은 기본값("large")으로 똑같이 그리고, 하이드레이션이 끝난 뒤(useEffect) 저장값으로 바꿔요.
  const [cardSize, setCardSize] = useState<CardSize>("large");

  useEffect(() => {
    // 외부 저장소(localStorage)의 값을 한 번 맞추는 용도라 effect 안에서 상태를 바꿔요.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCardSize(readCardSize());
  }, []);

  const moviesQuery = useQuery({
    // key에 page가 들어 있어 페이지마다 캐시를 따로 저장해요.
    ...movieQueries.list(currentPage),
    // 새 페이지를 불러오는 동안 이전 페이지 응답을 placeholder로 남겨 두어, 페이지 이동 버튼이 사라지지 않게 해요.
    placeholderData: keepPreviousData,
  });

  const movies = moviesQuery.data?.results ?? [];
  // 첫 응답을 받기 전에는 전체 페이지 수를 몰라서 0이 되고, 페이지 이동을 숨겨요.
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, MAX_TMDB_PAGE);
  // placeholder는 이전 페이지의 영화라서, 현재 페이지 응답이 올 때까지 목록 대신 로딩 문구를 보여 줘요.
  const isLoadingPage = moviesQuery.isPending || moviesQuery.isPlaceholderData;

  function handlePageChange(page: number) {
    router.push(page === 1 ? pathname : `${pathname}?page=${page}`);
  }

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

      {isLoadingPage ? (
        <StatusMessage>영화 목록을 불러오는 중이에요.</StatusMessage>
      ) : moviesQuery.isError ? (
        <StatusMessage isError>영화 목록을 불러오지 못했어요.</StatusMessage>
      ) : (
        <MovieGrid movies={movies} cardSize={cardSize} />
      )}

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
