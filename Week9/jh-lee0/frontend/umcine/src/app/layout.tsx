import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: "umcine",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-white">
            {/* 헤더는 지금 주소(메뉴 강조)를 읽으므로 Suspense로 감쌈, 기다리는 동안은 같은 높이의 빈 헤더 */}
            <Suspense
              fallback={
                <header className="h-[92px] shrink-0 border-b border-[#eceef1] bg-white" />
              }
            >
              <Header />
            </Suspense>
            <div className="flex flex-1 flex-col">
              {/* 여기에 자식 페이지가 들어감, 어느 주소로 가든 여기만 컴포넌트를 바꿔 끼는 것! */}
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
