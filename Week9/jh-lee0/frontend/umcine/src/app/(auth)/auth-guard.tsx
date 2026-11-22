"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthHydrated } from "@/hooks/use-store-hydrated";

// 8주차 미션의 검문소(beforeLoad)를 Next.js로 옮긴 것
// 토큰이 localStorage에 있어서 서버는 모르므로, 브라우저에서 확인하고 이동시킴
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // 토큰을 다 읽었는데 없으면 (= 로그인 안 함) 로그인 페이지로 보냄
    if (hydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hydrated, accessToken, router]);

  // 확인이 끝나기 전, 또는 로그인 페이지로 보내는 중에는 내용을 보여주지 않음
  if (!hydrated || !accessToken) {
    return (
      <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-20">
        <p className="text-gray-500">로그인 정보를 확인하는 중이에요...</p>
      </main>
    );
  }

  return children;
}
