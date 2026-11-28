import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],

    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          // 만료된 토큰 삭제
          useAuthStore.getState().setAccessToken(null);

          // 로그인 페이지가 아니라면 로그인 페이지로 이동
          if (window.location.pathname !== "/login") {
            window.location.assign("/login");
          }
        }
      },
    ],
  },
});
