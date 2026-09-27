import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  return (
    <header className="h-[92px] shrink-0 border-b border-[#eceef1] bg-white">
      <div className="mx-auto flex h-full w-[calc(100%-48px)] max-w-[1280px] items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-base font-extrabold tracking-[-0.02em] text-gray-900"
            aria-label="UMCine 홈"
          >
            <span className="grid size-7 place-items-center">
              <img src="/icons/movie.svg" alt="" className="size-7" />
            </span>
            <span className="text-xl font-extrabold">UMCine</span>
          </Link>

          <nav className="ml-10 flex gap-8" aria-label="주요 메뉴">
            <Link to="/" activeOptions={{ exact: true }}>
              {({ isActive }) => (
                <span
                  className={cn(
                    "inline-block border-b-2 py-2 text-sm font-semibold",
                    isActive
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-[#7b818b]"
                  )}
                >
                  영화
                </span>
              )}
            </Link>

            <Link
              to="/search"
              search={{}}
              activeOptions={{ includeSearch: false }}
            >
              {({ isActive }) => (
                <span
                  className={cn(
                    "inline-block border-b-2 py-2 text-sm font-semibold",
                    isActive
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-[#7b818b]"
                  )}
                >
                  검색
                </span>
              )}
            </Link>

            <Link to="/">
              <span className="inline-block border-b-2 border-transparent py-2 text-sm font-semibold text-[#7b818b]">
                내 정보
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            search={{}}
            className="grid size-9 place-items-center rounded-lg hover:bg-gray-100"
            aria-label="영화 검색"
          >
            <img src="/icons/search.svg" alt="" className="size-5" />
          </Link>
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;