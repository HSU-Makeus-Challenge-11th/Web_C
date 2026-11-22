import type { Metadata } from "next";
import { RootLayout } from "../components/root-layout";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = { title: "UMCine", description: "영화 목록, 검색, 평점" };

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><Providers><RootLayout>{children}</RootLayout></Providers></body></html>;
}
