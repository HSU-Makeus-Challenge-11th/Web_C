import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { memberQueries } from "../../api/members/member-queries";
import { useAuthStore } from "../../stores/auth-store";

const navLinkClass = "text-[15px] font-medium text-muted hover:text-text";

// 영화 상세의 본문(relative z-10)이 스크롤될 때 헤더를 덮지 않도록 헤더를 한 단계 위(z-20)에 둬요.
export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  // 토큰이 있을 때만 내 정보를 조회해요. 토큰이 유효한지는 이 요청의 응답으로 알 수 있어요.
  const meQuery = useQuery({
    ...memberQueries.me(),
    enabled: Boolean(accessToken),
  });

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-md">
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
          {/* 로그인 전에는 로그인 링크, 첫 조회 중에는 같은 크기의 로딩 표시, 로그인 후에는 마이페이지 링크를 보여 줘요.
              조회를 끈(enabled: false) 상태에서도 isPending은 참이라서, 실제로 요청 중인지는 isLoading으로 확인해요.
              토큰이 만료되어 401을 받으면 authApi가 토큰을 비워서 로그인 링크로 바뀌어요. */}
          {!accessToken ? (
            <Link
              to="/login"
              className={`px-2 ${navLinkClass}`}
              activeProps={{ className: "text-text font-semibold" }}
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span
              className="h-10 w-28 animate-pulse rounded-full bg-surface"
              role="status"
              aria-label="내 정보를 불러오는 중"
            />
          ) : (
            <Link
              to="/my"
              className="flex h-10 items-center gap-2 rounded-full pl-2 pr-3 text-muted hover:bg-surface hover:text-text"
              activeProps={{ className: "text-text" }}
            >
              <span className="icon icon--person" aria-hidden="true" />
              <span className="max-w-[120px] truncate text-[15px] font-medium">
                {meQuery.data?.nickname ?? "마이페이지"}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
