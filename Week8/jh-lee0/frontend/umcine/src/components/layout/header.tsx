import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
// ★ 2.3 추가: 서버 데이터 조회 훅, 내 정보 조회 함수(2.2-④), 토큰 보관함(2.2-①)
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

export function Header() {
  // ★ 2.3 추가: 토큰 보관함에서 토큰만 꺼내 옴 (로그인 안 했으면 null)
  const accessToken = useAuthStore((state) => state.accessToken);

  // ★ 2.3 추가: 내 정보 조회 (GET /members/me)
  const meQuery = useQuery({
    queryKey: ["members", "me"],   // 캐시 이름표 (2.1에서 본 그것, 2.4에서 이 이름표로 invalidate함)
    queryFn: getMe,                // 실제로 요청 보낼 함수
    enabled: Boolean(accessToken), // 토큰 있을 때만 요청 (없으면 아예 안 보냄)
    staleTime: 5 * 60 * 1000,      // 내 정보는 자주 안 바뀌니까 5분 동안 최신으로 취급
    retry: false,                  // 실패(401)해도 자동 재시도 안 함
  });

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

            <Link to="/my">
              {({ isActive }) => (
                <span
                  className={cn(
                    "inline-block border-b-2 py-2 text-sm font-semibold",
                    isActive
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-[#7b818b]"
                  )}
                >
                  내 정보
                </span>
              )}
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

          {/* ★ 2.3 변경: 원래 있던 <button>로그인</button>을 아래 3가지 경우로 교체 */}
          {!accessToken ? (
            // ① 토큰 없음 → 로그인 링크
            <Link
              to="/login"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            // ② 토큰 있고, 내 정보를 실제로 요청 중 → 버튼 크기의 회색 로딩 박스
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            // ③ 토큰 있고, 조회 끝남 → 마이페이지 링크
            <Link
              to="/my"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;