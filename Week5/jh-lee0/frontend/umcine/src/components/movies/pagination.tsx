import { useState } from "react";
import { cn } from "../../utils/cn";

function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [1, 2, 3, 4, 5];

  return (
    <nav className="flex h-9 items-center justify-center gap-3">
      <img
        className="size-6 opacity-30"
        src="/icons/chevron-left.svg"
        alt="이전"
      />
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={cn(
              "size-9 rounded-[7px] text-[13px] font-bold text-[#606774]",
              page === currentPage && "bg-[#17191e] text-white"
            )}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <img
        className="size-6"
        src="/icons/chevron-right.svg"
        alt="다음"
      />
    </nav>
  );
}

export default Pagination;