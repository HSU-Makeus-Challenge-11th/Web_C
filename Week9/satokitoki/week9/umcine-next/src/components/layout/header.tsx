"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { href: "/", label: "영화", exact: true },
  { href: "/search", label: "검색", exact: false },
  { href: "/my", label: "내 정보", exact: false },
];

// 현재 주소(usePathname)는 요청이 와야 알 수 있어요.
// 그래서 이 부분만 따로 떼어 Suspense로 감싸고, 나머지 헤더는 미리 만들어 둬요.
function NavLinks() {
  // TanStack Router의 activeProps 대신 현재 주소를 직접 비교해요.
  const pathname = usePathname();
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex gap-8">
      {NAV_ITEMS.map(({ href, label, exact }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "text-[15px]",
            isActive(href, exact)
              ? "font-semibold text-gray-900 underline underline-offset-[6px]"
              : "font-medium text-gray-600",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

// 주소를 알기 전에 잠깐 보여 줄 메뉴 (모두 선택 안 된 모양)
function NavLinksFallback() {
  return (
    <nav className="flex gap-8">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link key={href} href={href} className="text-[15px] font-medium text-gray-600">
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[88px] w-full max-w-[1440px] items-center justify-between px-20">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[22px] font-extrabold tracking-[-0.5px]"
          >
            <span className="flex size-[34px] items-center justify-center rounded-lg border-[2.5px] border-gray-900">
              <img src="/icons/movie.svg" alt="" className="size-[22px]" />
            </span>
            UMCine
          </Link>

          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-gray-200 bg-white"
          >
            <img src="/icons/search.svg" alt="" className="size-6" />
          </Link>

          {!accessToken ? (
            <Link
              href="/login"
              className="flex h-[42px] items-center rounded-md bg-[#1a66ff] px-[18px] text-sm font-bold text-white"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-[42px] w-24 animate-pulse rounded-md bg-gray-200" />
          ) : (
            <Link
              href="/my"
              className="flex h-[42px] items-center rounded-md border border-gray-200 bg-white px-[18px] text-sm font-bold text-gray-900"
            >
              {meQuery.data?.nickname ?? "마이페이지"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
