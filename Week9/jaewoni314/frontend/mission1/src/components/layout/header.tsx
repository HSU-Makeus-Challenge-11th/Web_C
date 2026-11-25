"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { memberQueries } from "@/api/members/member-queries";
import { useAuthStore } from "@/stores/auth-store";
import { NavLink } from "./nav-link";

const navLinkClass = "text-[15px] font-medium text-muted hover:text-text";
const activeNavLinkClass = "font-semibold text-text";

// 로그인 상태(Zustand)와 내 정보 조회(TanStack Query)를 쓰므로 Client Component예요.
// 지금 주소에 따른 메뉴 선택 표시는 NavLink가 맡아요.
// 영화 상세의 본문(relative z-10)이 스크롤될 때 헤더를 덮지 않도록 헤더를 한 단계 위(z-20)에 둬요.
export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  // 토큰이 있을 때만 내 정보를 조회해요. 토큰이 유효한지는 이 요청의 응답으로 알 수 있어요.
  const meQuery = useQuery({
    ...memberQueries.me(),
    enabled: Boolean(accessToken),
  });

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-5 px-6 sm:gap-10">
        <Link href="/" className="flex items-center gap-1.5 text-[22px] font-extrabold tracking-[-0.02em]">
          <span className="icon icon--movie text-accent" aria-hidden="true" />
          UMCine
        </Link>

        <nav className="flex gap-6" aria-label="주요 메뉴">
          <NavLink href="/" className={navLinkClass} activeClassName={activeNavLinkClass}>
            영화
          </NavLink>
          <NavLink href="/search" className={navLinkClass} activeClassName={activeNavLinkClass}>
            검색
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            // 좁은 화면에서는 메뉴의 "검색"으로 대신해요.
            className="hidden size-10 place-items-center rounded-full text-muted hover:bg-surface hover:text-text sm:grid"
            aria-label="영화 검색"
          >
            <span className="icon icon--search" aria-hidden="true" />
          </Link>
          {/* localStorage의 토큰을 읽기 전(서버 HTML, 하이드레이션 직후)과 내 정보 첫 조회 중에는 같은 크기의 로딩 표시를 보여 줘요.
              읽기 전에 "로그인" 링크부터 그리면, 로그인한 사용자에게도 잠깐 "로그인"이 보였다가 닉네임으로 바뀌어요.
              조회를 끈(enabled: false) 상태에서도 isPending은 참이라서, 실제로 요청 중인지는 isLoading으로 확인해요. */}
          {!hasHydrated || meQuery.isLoading ? (
            <span
              className="h-10 w-28 animate-pulse rounded-full bg-surface"
              role="status"
              aria-label="로그인 상태를 확인하는 중"
            />
          ) : !accessToken ? (
            <NavLink href="/login" className={`px-2 ${navLinkClass}`} activeClassName={activeNavLinkClass}>
              로그인
            </NavLink>
          ) : (
            <NavLink
              href="/my"
              match="prefix"
              className="flex h-10 items-center gap-2 rounded-full pl-2 pr-3 text-muted hover:bg-surface hover:text-text"
              activeClassName="text-text"
            >
              <span className="icon icon--person" aria-hidden="true" />
              <span className="max-w-[120px] truncate text-[15px] font-medium">
                {meQuery.data?.nickname ?? "마이페이지"}
              </span>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
