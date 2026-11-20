import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// 전체 페이지가 많아도 페이지 번호는 이 개수만큼만 보여 줘요.
const VISIBLE_PAGE_COUNT = 5;

const buttonClass =
  "grid size-9 place-items-center rounded-lg text-[15px] text-muted";

// 현재 페이지가 가운데 오도록 번호 범위를 정하고, 처음이나 끝에 가까우면 범위를 안쪽으로 당겨요.
function getVisiblePages(currentPage: number, totalPages: number) {
  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(VISIBLE_PAGE_COUNT / 2),
      totalPages - VISIBLE_PAGE_COUNT + 1,
    ),
  );
  const endPage = Math.min(totalPages, startPage + VISIBLE_PAGE_COUNT - 1);
  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="mt-14 flex items-center justify-center gap-2" aria-label="페이지 이동">
      <button
        type="button"
        className={cn(
          buttonClass,
          "hover:not-disabled:bg-surface hover:not-disabled:text-text disabled:cursor-default disabled:opacity-30",
        )}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span className="icon icon--chevron-left" aria-hidden="true" />
      </button>

      <ol className="flex gap-1">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={cn(
                buttonClass,
                page === currentPage
                  ? "bg-text font-bold text-bg"
                  : "hover:bg-surface hover:text-text",
              )}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className={cn(
          buttonClass,
          "hover:not-disabled:bg-surface hover:not-disabled:text-text disabled:cursor-default disabled:opacity-30",
        )}
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="icon icon--chevron-right" aria-hidden="true" />
      </button>
    </nav>
  );
}
