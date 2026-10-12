import { cn } from "../../utils/cn";

const pages = [1, 2, 3, 4, 5];
const currentPage = 1;

export default function Pagination() {
  return (
    <nav className="flex items-center justify-center gap-3 mt-[30px]" aria-label="페이지 이동">
      <button className="flex text-[#606774] disabled:text-[#d9e5ff]" type="button" aria-label="이전 페이지" disabled>
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
          >
            {page}
          </button>
        ))}
      </div>
      <button className="flex text-[#606774] disabled:text-[#d9e5ff]" type="button" aria-label="다음 페이지">
        <span className="icon icon-chevron-right" />
      </button>
    </nav>
  );
}