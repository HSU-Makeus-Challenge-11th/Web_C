import { cn } from "../../utils/cn";

const VISIBLE_PAGES = 5;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 현재 페이지 주변의 번호를 최대 5개까지 보여줘요.
  const startPage = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - VISIBLE_PAGES + 1),
  );
  const endPage = Math.min(totalPages, startPage + VISIBLE_PAGES - 1);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  return (
    <nav className="flex items-center justify-center gap-3 mt-[30px]" aria-label="페이지 이동">
      <button
        className="flex text-[#606774] disabled:text-[#d9e5ff]"
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span className="icon icon-chevron-left" />
      </button>
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[7px] text-[13px] font-bold",
              page === currentPage ? "bg-[#17191e] text-white" : "text-[#606774]",
            )}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className="flex text-[#606774] disabled:text-[#d9e5ff]"
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="icon icon-chevron-right" />
      </button>
    </nav>
  );
}
