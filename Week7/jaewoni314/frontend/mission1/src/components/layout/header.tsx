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
            // ?page=3처럼 페이지 번호가 붙어도 영화 메뉴를 선택된 상태로 보여 줘요.
            activeOptions={{ exact: true, includeSearch: false }}
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

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/search"
            // 좁은 화면에서는 메뉴의 "검색"으로 대신해요.
            className="hidden size-10 place-items-center rounded-full text-muted hover:bg-surface hover:text-text sm:grid"
            aria-label="영화 검색"
          >
            <span className="icon icon--search" aria-hidden="true" />
          </Link>
          {/* 8주차에 로그인 상태를 관리하면, 로그인 전에는 "로그인"을, 로그인 후에는 내 정보 아이콘을 보여 줄 예정이에요. */}
          <Link
            to="/login"
            className={`px-2 ${navLinkClass}`}
            activeProps={{ className: "text-text font-semibold" }}
          >
            로그인
          </Link>
          <Link
            to="/my"
            className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface hover:text-text"
            activeProps={{ className: "text-text" }}
            aria-label="내 정보"
          >
            <span className="icon icon--person" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
