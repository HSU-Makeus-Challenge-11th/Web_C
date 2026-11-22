"use client";

import Link from "next/link";
import { cn } from "../utils/cn";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";
import { useAuthHydrated } from "../hooks/use-auth-hydrated";

export function Header() {
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="shrink-0 border-b border-[#eceef1] bg-white">
      <div className="mx-auto flex w-[calc(100%-32px)] max-w-[1280px] flex-wrap items-center gap-y-1 pt-3 sm:h-[92px] sm:w-[calc(100%-48px)] sm:flex-nowrap sm:pt-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-extrabold tracking-[-0.02em] text-gray-900"
          aria-label="UMCine 홈"
        >
          <img src="/icons/movie.svg" alt="" className="size-7" />
          <span>UMCine</span>
        </Link>

        <nav className="order-last flex w-full gap-4 sm:order-none sm:ml-10 sm:w-auto sm:gap-8" aria-label="주요 메뉴">
          <Link href="/" className={cn("inline-block border-b-2 py-2 text-sm font-semibold", pathname === "/" ? "border-gray-900 text-gray-900" : "border-transparent text-[#7b818b]")}>영화</Link>
          
          <Link href="/search" className={cn("inline-block border-b-2 py-2 text-sm font-semibold", pathname === "/search" ? "border-gray-900 text-gray-900" : "border-transparent text-[#7b818b]")}>검색</Link>
          <Link href="/members" className={cn("inline-block border-b-2 py-2 text-sm font-semibold", pathname === "/members" ? "border-gray-900 text-gray-900" : "border-transparent text-[#7b818b]")}>회원·평점</Link>
        </nav>
        <nav aria-label="계정 메뉴" className="ml-auto flex items-center gap-4 text-sm font-semibold">
          {!hydrated || (accessToken && meQuery.isLoading) ? <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" /> : (
            <Link href={accessToken ? "/me" : "/login"} className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50">
              {accessToken ? "내 정보" : "로그인"}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
