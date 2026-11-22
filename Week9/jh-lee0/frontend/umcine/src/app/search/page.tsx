import { Suspense } from "react";
import { SearchPage } from "@/screens/movies/search-page";

// 주소: /search?query=검색어
// 검색어(?query=)는 요청이 와야 알 수 있으므로 Suspense로 감쌈
export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-[calc(100%-32px)] max-w-[1280px] flex-1 py-8 sm:w-[calc(100%-48px)]">
          <p className="py-20 text-center text-gray-500">
            검색 화면을 불러오는 중이에요...
          </p>
        </main>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
