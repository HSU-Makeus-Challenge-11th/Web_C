import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/_auth")({
  // 하위 페이지를 보여 주기 전에 로그인 여부를 확인합니다
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  // 하위 페이지(마이페이지, 내 정보 수정)가 Outlet 자리에 그려집니다
  component: () => <Outlet />,
});
