import { createFileRoute, redirect } from "@tanstack/react-router"; // ★ redirect 추가
import { LoginPage } from "@/pages/auth/login-page";
import { useAuthStore } from "@/stores/auth-store";                   // ★ 토큰 보관함 가져오기

export const Route = createFileRoute("/login")({
  // (8주차)추가: 페이지를 보여주기 "전에" 실행되는 검문소
  beforeLoad: () => {
    // 보관함에 토큰이 있으면 (= 이미 로그인함)
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: "/" }); // 홈으로 보냄
    }
  },
  component: LoginPage,
});