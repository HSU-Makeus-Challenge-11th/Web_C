import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusMessage } from "@/components/movies/status-message";
import { SearchPage } from "@/screens/movies/search-page";

// 루트 layout의 title.template("%s | UMCine")에 들어가서 탭 제목이 "영화 검색 | UMCine"이 돼요.
export const metadata: Metadata = {
  title: "영화 검색",
  description: "TMDB에서 보고 싶은 영화를 제목으로 찾아보세요.",
};

// 8주차 routes/search.tsx → app/search/page.tsx (/search?query=)
export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-[1200px] px-6 pb-16 pt-12">
          <h1 className="text-[32px] font-bold tracking-[-0.02em]">영화 검색</h1>
          <StatusMessage>검색 화면을 준비하는 중이에요.</StatusMessage>
        </main>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
