export default function Pagination() {
  return (
    <nav
      className="mt-12 flex items-center justify-center gap-4"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className="flex p-1 disabled:cursor-default"
        disabled
        aria-label="이전 페이지"
      >
        <img
          src="/icons/chevron-left.svg"
          alt=""
          className="size-5 opacity-35"
        />
      </button>
      <button
        type="button"
        className="size-9 rounded-md bg-gray-900 text-sm font-bold text-white"
        aria-current="page"
      >
        1
      </button>
      <button
        type="button"
        className="flex p-1 disabled:cursor-default"
        disabled
        aria-label="다음 페이지"
      >
        <img
          src="/icons/chevron-right.svg"
          alt=""
          className="size-5 opacity-35"
        />
      </button>
    </nav>
  );
}
