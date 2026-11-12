import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { memberQueries } from "../../api/members/member-queries";
import { useAuthStore } from "../../stores/auth-store";

// 서버에 로그아웃 API가 없어서, 이 브라우저의 토큰과 회원별 캐시를 지우는 것으로 로그아웃해요.
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return async () => {
    // 로그인 전용 페이지에서 토큰을 먼저 지우면 Layout이 로그인 화면으로 보내요. 홈으로 먼저 이동한 뒤 지워요.
    await navigate({ to: "/" });
    setAccessToken(null);
    // 다른 회원이 이어서 로그인했을 때 이전 회원의 정보가 잠깐이라도 보이지 않게 캐시를 지워요.
    queryClient.removeQueries({ queryKey: memberQueries.me().queryKey });
    alert("로그아웃했어요.");
  };
}
