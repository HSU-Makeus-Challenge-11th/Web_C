"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  // exact: 경로가 같을 때만, prefix: 하위 경로(/my/edit)까지 선택 상태로 보여 줘요.
  match?: "exact" | "prefix";
  children: ReactNode;
}

// TanStack Router의 <Link activeProps>를 대신하는 메뉴 링크예요.
// usePathname()은 요청을 받아야 알 수 있는 값이라, Cache Components 설정에서 Suspense 밖에서 읽으면
// 동적 경로(/movies/[movieId])의 미리 렌더링(prerender)을 막아 빌드가 실패해요.
// 그래서 지금 경로가 필요한 부분만 Suspense로 감싸고, 그동안은 선택 표시 없는 같은 링크를 보여 줘요.
export function NavLink(props: NavLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} className={props.className}>
          {props.children}
        </Link>
      }
    >
      <ActiveNavLink {...props} />
    </Suspense>
  );
}

function ActiveNavLink({ href, className, activeClassName, match = "exact", children }: NavLinkProps) {
  // pathname에는 ?page=3 같은 쿼리가 들어 있지 않아서, 페이지 번호가 붙어도 "영화" 메뉴가 선택돼요.
  const pathname = usePathname();
  const isActive = match === "exact" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(className, isActive && activeClassName)}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
