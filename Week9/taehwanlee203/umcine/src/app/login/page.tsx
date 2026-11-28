"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "../../views/auth/login";
import { useAuthStore } from "../../stores/auth-store";

export default function LoginRoutePage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  if (accessToken) return null;
  return <LoginPage />;
}
