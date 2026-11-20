"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { StatusMessage } from "@/components/movies/status-message";
import { useAuthStore } from "@/stores/auth-store";

// 로그인 전용 페이지들의 공통 Layout이에요. 하위 페이지(/my, /my/edit)가 children 자리에 그려져요.
// 8주차에는 TanStack Router의 beforeLoad가 페이지를 그리기 전에 막았어요.
// 토큰이 localStorage(브라우저)에만 있어서 서버는 로그인 여부를 알 수 없으므로, 브라우저에서 토큰을 읽은 뒤에 확인해요.
export function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const signedOut = useAuthStore((state) => state.signedOut);
  // 토큰이 처음부터 없었는지(직접 접속) 보는 중에 사라졌는지(만료, 로그아웃) 구분해서 알림을 한 번만 띄워요.
  const wasLoggedIn = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (accessToken) {
      wasLoggedIn.current = true;
      return;
    }
    // 직접 로그아웃했으면 홈으로 보내요. (useLogout이 이미 홈으로 이동 중이에요.)
    if (signedOut) {
      router.replace("/");
      return;
    }
    // 페이지를 보는 중에 토큰이 만료되면(401) authApi가 토큰을 비워요. 그때도 로그인 화면으로 보내요.
    if (!wasLoggedIn.current) {
      alert("로그인이 필요한 페이지예요.");
    }
    router.replace("/login");
  }, [accessToken, hasHydrated, signedOut, router]);

  // 토큰을 읽기 전이나 이동하는 중에는 로그인 전용 화면을 그리지 않아요.
  if (!hasHydrated || !accessToken) {
    return (
      <main className="mx-auto max-w-[1200px] px-6">
        <StatusMessage>로그인 상태를 확인하는 중이에요.</StatusMessage>
      </main>
    );
  }

  return children;
}
