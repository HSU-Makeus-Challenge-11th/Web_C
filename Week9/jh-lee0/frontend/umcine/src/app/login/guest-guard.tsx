"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthHydrated } from "@/hooks/use-store-hydrated";

// 8주차 /login 검문소(beforeLoad)를 Next.js로 옮긴 것
// 이미 로그인했으면 홈으로 보냄 (토큰이 localStorage에 있어서 브라우저에서 확인)
export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && accessToken) {
      router.replace("/");
    }
  }, [hydrated, accessToken, router]);

  return children;
}
