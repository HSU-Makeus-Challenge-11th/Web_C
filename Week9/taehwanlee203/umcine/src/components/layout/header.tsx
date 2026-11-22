"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

export function Header() {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: me, isPending } = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const activeLinkClass =
    "text-black font-extrabold underline underline-offset-4 decoration-1";

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div>
              <img src="/icon/movie.svg" alt="" className="logo-icon" />
            </div>

            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              UMCine
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link
              href="/"
              className={cn(
                "hover:text-black transition-colors",
                pathname === "/" && activeLinkClass,
              )}
            >
              영화
            </Link>

            <Link
              href="/search"
              className={cn(
                "hover:text-black transition-colors",
                pathname === "/search" && activeLinkClass,
              )}
            >
              검색
            </Link>

            <Link
              href="/my"
              className={cn(
                "hover:text-black transition-colors",
                pathname === "/my" && activeLinkClass,
              )}
            >
              내 정보
            </Link>
          </nav>
        </div>

        {/* 우측: 돋보기 아이콘 + 로그인 상태 */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            aria-label="검색"
            className="w-9 h-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>

          {/* 로그인하지 않은 경우 */}
          {!accessToken && (
            <Link
              href="/login"
              className="h-9 px-4 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center"
            >
              로그인
            </Link>
          )}

          {/* 사용자 정보 확인 중 */}
          {accessToken && isPending && (
            <span className="text-sm text-gray-400">불러오는 중...</span>
          )}

          {/* 로그인한 경우 */}
          {accessToken && me && (
            <span className="text-sm font-semibold text-gray-700">
              {me.nickname}님
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
