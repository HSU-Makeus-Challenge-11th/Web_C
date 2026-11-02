import ky from "ky";

// 우리 스프링 서버 주소 (TMDB와 달리 토큰이 필요 없어요)
export const umcClient = ky.create({
  baseUrl: "http://localhost:8080/",
});
