"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated, useAuthStore } from "../../stores/auth-store";

// TanStack Router의 _auth/route.tsx(beforeLoad)를 대신해요.
// 토큰은 localStorage에 있어서 서버에서는 확인할 수 없으므로, 브라우저에서 확인해요.
export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isHydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [isHydrated, accessToken, router]);

  if (!isHydrated || !accessToken) {
    return (
      <main className="flex-1 py-32 text-center text-sm text-gray-500">
        로그인 정보를 확인하는 중이에요.
      </main>
    );
  }

  return children;
}
