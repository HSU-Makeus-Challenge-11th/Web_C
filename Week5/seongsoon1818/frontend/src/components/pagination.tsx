import { cn } from "../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

const buttonClass =
  "grid size-9 cursor-pointer place-items-center rounded-md text-sm transition-colors";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange = () => undefined,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // TMDB의 많은 페이지를 한꺼번에 렌더링하지 않고 현재 번호 주변만 표시합니다.
  const visibleCount = Math.min(5, totalPages);
  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - visibleCount + 1));
  const pages = Array.from({ length: visibleCount }, (_, index) => firstPage + index);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav
      aria-label="영화 목록 페이지"
      className="mt-[52px] flex min-h-10 items-center justify-center gap-1.5"
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          buttonClass,
          isFirstPage
            ? "cursor-default opacity-35"
            : "hover:bg-[#e7ebf0]",
        )}
      >
        <img src="/icons/chevron-left.svg" alt="" className="size-6" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={cn(
            buttonClass,
            page === currentPage
              ? "bg-brand font-bold text-white"
              : "text-[#646b76] hover:bg-[#e7ebf0]",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          buttonClass,
          isLastPage
            ? "cursor-default opacity-35"
            : "hover:bg-[#e7ebf0]",
        )}
      >
        <img src="/icons/chevron-right.svg" alt="" className="size-6" />
      </button>
    </nav>
  );
}