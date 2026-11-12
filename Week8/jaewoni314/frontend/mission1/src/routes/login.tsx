import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/login")({
  // 페이지를 그리기 전에 실행돼요. 이미 로그인했다면 로그인 화면 대신 홈으로 보내요.
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
