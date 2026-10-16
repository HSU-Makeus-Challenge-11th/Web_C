import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buttonClass =
  "grid size-9 place-items-center rounded-lg text-[15px] text-muted";

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

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
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="icon icon--chevron-right" aria-hidden="true" />
      </button>
    </nav>
  );
}
