import type { NextConfig } from "next";

// 10주차: 우리 백엔드(NestJS) 주소예요. 서버에서만 쓰므로 NEXT_PUBLIC_을 붙이지 않아요. 예) http://{EC2_PUBLIC_IP}:3000
// Vercel 페이지는 HTTPS라서, 브라우저가 HTTP인 EC2 API를 직접 부르면 혼합 콘텐츠(Mixed Content)로 막혀요.
// 그래서 브라우저는 같은 주소의 /api/umc/...로 요청하고, Next.js 서버가 백엔드로 대신 전달(rewrite)해요.
// 이 값이 없으면(로컬 개발) rewrite를 만들지 않고, NEXT_PUBLIC_API_BASE_URL=http://localhost:3000으로 직접 호출해요.
const umcApiOrigin = process.env.UMC_API_ORIGIN?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!umcApiOrigin) return [];
    return [{ source: "/api/umc/:path*", destination: `${umcApiOrigin}/:path*` }];
  },
  // create-next-app 기본 설정이에요. 요청을 받은 뒤에야 알 수 있는 값(params, searchParams 등)을 읽는 부분은 Suspense 안에 둬야 해요.
  cacheComponents: true,
  partialPrefetching: true,
  // next/image로 최적화할 외부 이미지 서버를 허용해요. TMDB 포스터와 배경 이미지만 받아요.
  images: {
    remotePatterns: [new URL("https://image.tmdb.org/t/p/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
