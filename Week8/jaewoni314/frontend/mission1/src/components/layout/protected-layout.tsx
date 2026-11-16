import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 로그인 전용 페이지들의 공통 Layout이에요. 하위 페이지(/my, /my/edit)가 <Outlet /> 자리에 그려져요.
export function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 페이지를 보는 중에 토큰이 만료되면(401) authApi가 토큰을 비워요.
  // beforeLoad는 이동할 때만 실행되므로, 여기서도 토큰이 사라지면 로그인 화면으로 보내요.
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
