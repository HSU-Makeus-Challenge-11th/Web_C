import ky from "ky";

// 브라우저는 TMDB가 아니라 같은 Next.js 서버의 Route Handler(/api/tmdb/...)로 요청해요.
// 토큰은 Route Handler가 서버에서 붙이므로 여기에는 없어요. 상대 주소는 지금 페이지의 주소를 기준으로 풀려요.
export const tmdbClient = ky.create({
  baseUrl: "/api/tmdb/",
  // 재시도는 TanStack Query가 맡아요. ky도 재시도하면 실패한 요청 하나가 최대 12번(3번 × 4번)까지 늘어났어요.
  retry: 0,
});
