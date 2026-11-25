import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
