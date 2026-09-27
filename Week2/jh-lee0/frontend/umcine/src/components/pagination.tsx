import { useState } from "react";

function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [1, 2, 3, 4, 5];

  return (
    <nav className="pagination">
      <img
        className="pagination__arrow is-disabled"
        src="/icons/chevron-left.svg"
        alt="이전"
      />
      <div className="pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? "is-active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <img
        className="pagination__arrow"
        src="/icons/chevron-right.svg"
        alt="다음"
      />
    </nav>
  );
}

export default Pagination;