const pages = [1, 2, 3, 4, 5];
const currentPage = 1;

export default function Pagination() {
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button className="page-arrow" type="button" aria-label="이전 페이지" disabled>
        <span className="icon icon-chevron-left" />
      </button>
      <div className="page-list">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={page === currentPage ? "page-btn is-active" : "page-btn"}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      <button className="page-arrow" type="button" aria-label="다음 페이지">
        <span className="icon icon-chevron-right" />
      </button>
    </nav>
  );
}