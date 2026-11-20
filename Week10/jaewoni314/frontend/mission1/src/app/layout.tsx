import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AuthHydrator } from "@/components/providers/auth-hydrator";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

// 8주차에는 CSS에서 jsDelivr CDN의 Pretendard CSS를 @import해서, 폰트 CSS와 파일을 외부 서버에서 받아 왔어요.
// next/font는 빌드할 때 폰트 파일을 우리 앱의 정적 파일로 옮기고(셀프 호스팅) 미리 불러오도록(preload) 해 줘요.
// Pretendard는 Google Fonts에 없어서 npm 패키지의 가변 폰트(woff2) 하나를 next/font/local로 불러와요.
const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  weight: "45 920",
  display: "swap",
  variable: "--font-pretendard",
});

// 모든 페이지의 기본 메타데이터예요. 페이지가 title을 정하면 template의 %s 자리에 들어가요. (예: "영화 검색 | UMCine")
export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "TMDB 인기 영화를 둘러보고, 즐겨찾기와 평점을 남기는 UMCine",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "UMCine",
    description: "TMDB 인기 영화를 둘러보고, 즐겨찾기와 평점을 남기는 UMCine",
    siteName: "UMCine",
    locale: "ko_KR",
    type: "website",
  },
};

// 8주차의 __root.tsx(Header + Outlet + Footer)가 Next.js의 Root Layout이 됐어요. <Outlet /> 자리가 {children}이에요.
// 이 파일은 Server Component예요. 상태를 쓰는 Provider와 Header만 Client Component로 나눠 불러와요.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <QueryProvider>
          <AuthHydrator />
          <Header />
          {children}
          <Footer />
        </QueryProvider>
        {/* 10주차 선택 미션: Vercel Web Analytics. 페이지 이동마다 방문/조회 데이터를 Vercel 대시보드의 Analytics로 보내요.
            Vercel에 배포된 사이트에서만 수집하고, 로컬 개발 서버에서는 콘솔에만 찍혀요. */}
        <Analytics />
      </body>
    </html>
  );
}
