import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { favoriteQueries } from "../../api/favorites/favorite-queries";
import { memberQueries } from "../../api/members/member-queries";
import { ratingQueries } from "../../api/ratings/rating-queries";
import { useAuthStore } from "../../stores/auth-store";

// 서버에 로그아웃 API가 없어서, 이 브라우저의 토큰과 회원별 캐시를 지우는 것으로 로그아웃해요.
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);

  return () => {
    // 8주차에는 await navigate()로 홈 이동이 끝난 뒤 토큰을 지웠어요. Next.js의 router.push()는 이동이 끝날 때까지 기다릴 수 없어서,
    // 마이페이지에서 토큰을 지우면 로그인 전용 Layout이 홈 이동보다 먼저 로그인 화면으로 보낼 수 있어요.
    // signOut()으로 "직접 로그아웃했다"는 표시를 함께 남기면 Layout도 로그인 화면 대신 홈으로 보내요.
    signOut();
    router.push("/");
    // 다른 회원이 이어서 로그인했을 때 이전 회원의 정보가 잠깐이라도 보이지 않게 캐시를 지워요.
    queryClient.removeQueries({ queryKey: memberQueries.me().queryKey });
    queryClient.removeQueries({ queryKey: favoriteQueries.all() });
    queryClient.removeQueries({ queryKey: ratingQueries.all() });
    alert("로그아웃했어요.");
  };
}
