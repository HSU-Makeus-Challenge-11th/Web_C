import { Link } from "@tanstack/react-router";
import { cn } from "../utils/cn";

export function Header() {
  return (
    <header className="shrink-0 border-b border-[#eceef1] bg-white">
      <div className="mx-auto flex w-[calc(100%-32px)] max-w-[1280px] flex-wrap items-center gap-y-1 pt-3 sm:h-[92px] sm:w-[calc(100%-48px)] sm:flex-nowrap sm:pt-0">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-base font-extrabold tracking-[-0.02em] text-gray-900"
          aria-label="UMCine 홈"
        >
          <img src="/icons/movie.svg" alt="" className="size-7" />
          <span>UMCine</span>
        </Link>

        <nav className="order-last flex w-full gap-4 sm:order-none sm:ml-10 sm:w-auto sm:gap-8" aria-label="주요 메뉴">
          <Link
            to="/"
            activeOptions={{ exact: true, includeSearch: false }}
          >
            {({ isActive }) => (
              <span
                className={cn(
                  "inline-block border-b-2 py-2 text-sm font-semibold",
                  isActive
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-[#7b818b]",
                )}
              >
                영화
              </span>
            )}
          </Link>
          
          <Link
            to="/search"
            search={{}}
            activeOptions={{ exact: true, includeSearch: false }}
          >
            {({ isActive }) => (
              <span
                className={cn(
                  "inline-block border-b-2 py-2 text-sm font-semibold",
                  isActive
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-[#7b818b]",
                )}
              >
                검색
              </span>
            )}
          </Link>
          <Link to="/members" activeOptions={{ exact: true }}>
            {({ isActive }) => (
              <span className={cn("inline-block border-b-2 py-2 text-sm font-semibold", isActive ? "border-gray-900 text-gray-900" : "border-transparent text-[#7b818b]")}>
                회원·평점
              </span>
            )}
          </Link>
        </nav>
        <nav aria-label="계정 메뉴" className="ml-auto flex items-center gap-4 text-sm font-semibold">
          <Link to="/login" className="py-2 text-gray-600 hover:text-brand" activeProps={{ className: "text-brand" }}>
            로그인
          </Link>
          <Link to="/me" className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50" activeProps={{ className: "border-brand text-brand" }}>
            내 정보
          </Link>
        </nav>
      </div>
    </header>
  );
}
