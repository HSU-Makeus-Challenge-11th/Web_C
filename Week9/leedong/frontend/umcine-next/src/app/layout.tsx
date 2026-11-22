import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { AuthHydrator } from "@/providers/auth-hydrator";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UMCine",
    template: "%s | UMCine",
  },
  description: "영화를 찾고, 즐겨찾기하고, 평점을 남기는 UMCine",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body>
        <QueryProvider>
          <AuthHydrator />
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
