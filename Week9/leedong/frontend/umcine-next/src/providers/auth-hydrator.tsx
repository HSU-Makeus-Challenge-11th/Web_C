"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

// localStorage는 브라우저에만 있어요.
// 서버에서 만든 HTML과 첫 화면이 같도록, 브라우저에서 마운트된 뒤에 저장된 토큰을 복원해요.
export function AuthHydrator() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
