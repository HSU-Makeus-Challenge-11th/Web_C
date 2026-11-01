import ky from "ky";
import { env } from "../config/env";

// 우리 백엔드(NestJS) 요청용 인스턴스예요. TMDB 토큰은 보내지 않아요.
export const umcClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
});
