import type { Metadata } from "next";
import "../index.css";
import { Providers } from "./providers";
import { Header } from "../components/layout/header";
import Pagination from "../components/movies/pagination";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화 탐색 및 평점 서비스 UMCine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
          <Pagination />
        </Providers>
      </body>
    </html>
  );
}
