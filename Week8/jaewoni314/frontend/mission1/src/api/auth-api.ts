import { useAuthStore } from "../stores/auth-store";
import { umcClient } from "./umc-client";

// extend는 umcClient의 설정(서버 주소)을 이어받은 새 인스턴스를 만들어요.
// 로그인이 필요 없는 요청은 umcClient로, 필요한 요청은 authApi로 보내요.
export const authApi = umcClient.extend({
  // 재시도는 TanStack Query가 맡아요. 인증 요청까지 ky가 재시도하면 실패한 요청이 몇 배로 늘어나요.
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 컴포넌트 바깥이라 훅 대신 getState()로 요청 직전의 최신 토큰을 읽어요.
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 토큰이 없거나 만료/위조되어 401을 받으면 토큰을 비워요.
        // 헤더가 로그인 링크로 바뀌고, 로그인 전용 페이지는 로그인 화면으로 보내요.
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
