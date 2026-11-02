import { Link } from "@tanstack/react-router";

const navLinkProps = {
  className: "text-[15px]",
  activeProps: {
    className: "font-semibold text-gray-900 underline underline-offset-[6px]",
  },
  inactiveProps: { className: "font-medium text-gray-600" },
};

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[88px] w-full max-w-[1440px] items-center justify-between px-20">
        <div className="flex items-center gap-12">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[22px] font-extrabold tracking-[-0.5px]"
          >
            <span className="flex size-[34px] items-center justify-center rounded-lg border-[2.5px] border-gray-900">
              <img src="/icons/movie.svg" alt="" className="size-[22px]" />
            </span>
            UMCine
          </Link>

          <nav className="flex gap-8">
            <Link to="/" activeOptions={{ exact: true }} {...navLinkProps}>
              영화
            </Link>
            <Link to="/search" {...navLinkProps}>
              검색
            </Link>
            <Link to="/my" {...navLinkProps}>
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-gray-200 bg-white"
          >
            <img src="/icons/search.svg" alt="" className="size-6" />
          </Link>
          <button
            type="button"
            className="h-[42px] rounded-md bg-[#1a66ff] px-[18px] text-sm font-bold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
