"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// 로그인한 사용자만 볼 수 있는 화면을 감싸요. (기존 beforeLoad redirect를 대체)
// 토큰이 localStorage에 있어서 서버에서는 알 수 없으므로 브라우저에서 확인해요.
export function ProtectedGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) return null;

  return <>{children}</>;
}

// 이미 로그인했다면 로그인 화면 대신 메인으로 보내요.
export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && accessToken) router.replace("/");
  }, [hydrated, accessToken, router]);

  if (!hydrated || accessToken) return null;

  return <>{children}</>;
}
