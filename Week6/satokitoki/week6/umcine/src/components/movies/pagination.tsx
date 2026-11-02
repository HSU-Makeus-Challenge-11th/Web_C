import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PAGE_GROUP_SIZE = 5;
// TMDB는 500페이지까지만 조회할 수 있어요.
const MAX_PAGE = 500;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.min(totalPages, MAX_PAGE);
  if (lastPage <= 1) return null;

  // 현재 페이지가 들어 있는 5개 묶음 (1~5, 6~10, ...)
  const groupStart =
    Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, lastPage);
  const pages = Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, index) => groupStart + index,
  );

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-4"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className="flex p-1 disabled:cursor-default"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <img
          src="/icons/chevron-left.svg"
          alt=""
          className={cn("size-5", currentPage === 1 && "opacity-35")}
        />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "size-9 rounded-md text-sm font-bold",
            page === currentPage ? "bg-gray-900 text-white" : "text-gray-700",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="flex p-1 disabled:cursor-default"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <img
          src="/icons/chevron-right.svg"
          alt=""
          className={cn("size-5", currentPage === lastPage && "opacity-35")}
        />
      </button>
    </nav>
  );
}
