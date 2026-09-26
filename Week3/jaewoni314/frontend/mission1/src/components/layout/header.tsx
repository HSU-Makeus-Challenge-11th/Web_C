import { Link } from "@tanstack/react-router";

const navLinkClass = "text-[15px] font-medium text-muted hover:text-text";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-5 px-6 sm:gap-10">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[22px] font-extrabold tracking-[-0.02em]"
        >
          <span className="icon icon--movie text-accent" aria-hidden="true" />
          UMCine
        </Link>

        <nav className="flex gap-6" aria-label="주요 메뉴">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={navLinkClass}
            activeProps={{ className: "text-text font-semibold" }}
          >
            영화
          </Link>
          <Link
            to="/search"
            className={navLinkClass}
            activeProps={{ className: "text-text font-semibold" }}
          >
            검색
          </Link>
        </nav>

        <div className="ml-auto flex gap-2">
          <Link
            to="/search"
            className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface hover:text-text"
            aria-label="영화 검색"
          >
            <span className="icon icon--search" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface hover:text-text"
            aria-label="내 정보"
          >
            <span className="icon icon--person" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
