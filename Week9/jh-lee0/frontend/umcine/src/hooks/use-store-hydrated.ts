import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

// 9주차: 로그인 토큰을 localStorage에서 다 읽어왔는지 알려주는 훅
// 읽기 전에는 토큰이 항상 null이라, 이걸 확인하지 않으면 로그인한 사람도 로그인 페이지로 보내버림
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 이미 다 읽었으면 바로 true, 아니면 다 읽는 순간 true
    // (useEffect 안에서 setState를 바로 부르지 않으려고 구독 콜백 + Promise로 처리)
    const unsubscribe = useAuthStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    if (useAuthStore.persist.hasHydrated()) {
      void Promise.resolve().then(() => setHydrated(true));
    }
    return unsubscribe;
  }, []);

  return hydrated;
}
