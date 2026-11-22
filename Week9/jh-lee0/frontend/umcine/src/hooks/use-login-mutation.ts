import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient(); // 캐시 관리자 꺼내기 (2.1)
  const router = useRouter();           // 페이지 이동 함수 꺼내기
  const setAccessToken = useAuthStore((state) => state.setAccessToken); // 토큰 저장 함수 꺼내기

  return useMutation({
    mutationFn: login, // 보낼 요청: POST /auth/login (2.2-③에서 만든 함수)
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken); // ① 서버가 준 토큰을 보관함에 저장
      alert("로그인에 성공했어요.");
      queryClient.invalidateQueries({ queryKey: ["members", "me"] }); // ② 내 정보 캐시 "낡음" 표시 → 헤더가 다시 조회
      router.push("/");                                               // ③ 홈으로 이동
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}