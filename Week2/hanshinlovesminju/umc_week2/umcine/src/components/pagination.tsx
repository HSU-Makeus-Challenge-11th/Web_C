// src/components/pagination.tsx
import { useState } from "react";
import "./pagination.css";

interface PaginationProps {
  totalPages: number;
}

function Pagination({ totalPages }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination__arrow-btn"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <img src="/icons/chevron-left.svg" alt="이전 페이지" />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={
            page === currentPage
              ? "pagination__page-btn pagination__page-btn--active"
              : "pagination__page-btn"
          }
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="pagination__arrow-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <img src="/icons/chevron-right.svg" alt="다음 페이지" />
      </button>
    </div>
  );
}

export default Pagination;