import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/views/movies/search-page";

export const metadata: Metadata = {
  title: "영화 검색",
};

export default function Page() {
  // SearchPage는 useSearchParams를 쓰므로 Suspense로 감싸요.
  return (
    <Suspense fallback={<main>검색 화면을 불러오는 중이에요.</main>}>
      <SearchPage />
    </Suspense>
  );
}
