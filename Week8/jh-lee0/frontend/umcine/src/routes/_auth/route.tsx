import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

// 8주차 미션: 로그인한 사람만 들어갈 수 있는 페이지들의 공통 레이아웃
// 폴더 이름이 _로 시작해서 주소에는 안 나타남 (/my, /my/edit 그대로)
export const Route = createFileRoute("/_auth")({
  // 페이지를 보여주기 전에 실행되는 검문소 (2.4의 /login 검문소와 반대)
  beforeLoad: () => {
    // 토큰이 없으면 (= 로그인 안 함) 로그인 페이지로 보냄
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  // 검문소를 통과하면 <Outlet /> 자리에 자식 페이지(마이페이지, 수정 페이지)가 들어감
  component: () => <Outlet />,
});