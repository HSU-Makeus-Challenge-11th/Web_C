interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination__arrow"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span className="icon icon--chevron-left" aria-hidden="true" />
      </button>

      <ol className="pagination__list">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={page === currentPage ? "pagination__page pagination__page--active" : "pagination__page"}
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
        className="pagination__arrow"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="icon icon--chevron-right" aria-hidden="true" />
      </button>
    </nav>
  );
}
