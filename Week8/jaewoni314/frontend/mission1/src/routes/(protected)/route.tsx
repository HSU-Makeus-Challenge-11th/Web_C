import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProtectedLayout } from "../../components/layout/protected-layout";
import { useAuthStore } from "../../stores/auth-store";

// (protected) 폴더의 공통 Layout Route예요. 괄호로 감싼 Route Group이라 URL에는 들어가지 않아요. (/my, /my/edit)
// 하위 페이지를 그리기 전에 beforeLoad가 먼저 실행돼서, 로그인하지 않았다면 로그인 화면으로 보내요.
export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      alert("로그인이 필요한 페이지예요.");
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});
