"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

// 하이드레이션이 끝난 뒤(useEffect는 브라우저에서만 실행돼요) localStorage의 토큰을 store로 읽어 와요.
// 서버 HTML과 브라우저의 첫 화면을 똑같이 "로그인 확인 전" 상태로 맞춘 다음, 그 뒤에 로그인 상태로 바꿔요.
export function AuthHydrator() {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
