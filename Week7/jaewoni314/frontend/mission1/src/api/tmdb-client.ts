import ky from "ky";
import { env } from "../config/env";

export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
  // 재시도는 TanStack Query가 맡아요. ky도 재시도하면 실패한 요청 하나가 최대 12번(3번 × 4번)까지 늘어났어요.
  retry: 0,
});
