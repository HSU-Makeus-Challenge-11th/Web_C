export default function Pagination() {
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination__arrow"
        disabled
        aria-label="이전 페이지"
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>
      <button
        type="button"
        className="pagination__page active"
        aria-current="page"
      >
        1
      </button>
      <button
        type="button"
        className="pagination__arrow"
        disabled
        aria-label="다음 페이지"
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
