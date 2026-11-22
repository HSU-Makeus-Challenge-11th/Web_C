import type { Metadata } from "next";
import { Header } from "../components/layout/header";
import Footer from "../components/layout/footer";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "TMDB 영화 정보를 보고 평점과 즐겨찾기를 남기는 서비스예요.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-[#f6f7f9]">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
