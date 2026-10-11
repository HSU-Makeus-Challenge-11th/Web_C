import { Link } from "@tanstack/react-router";
import { cn } from "../utils/cn";

export function Header() {
  return (
    <header className="h-[92px] shrink-0 border-b border-[#eceef1] bg-white">
      <div className="mx-auto flex h-full w-[calc(100%-48px)] max-w-[1280px] items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-base font-extrabold tracking-[-0.02em] text-gray-900"
          aria-label="UMCine 홈"
        >
          <img src="/icons/movie.svg" alt="" className="size-7" />
          <span>UMCine</span>
        </Link>

        <nav className="ml-10 flex gap-8" aria-label="주요 메뉴">
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
        </nav>
      </div>
    </header>
  );
}