import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPage } from "../../screens/movies/search-page";

export const metadata: Metadata = {
  title: "영화 검색 | UMCine",
};

export default function Page() {
  // useSearchParams()는 요청이 와야 값을 알 수 있어서 Suspense 안에서 사용해요.
  return (
    <Suspense
      fallback={<main className="flex-1 py-48 text-center text-gray-500">검색 화면을 준비하는 중이에요.</main>}
    >
      <SearchPage />
    </Suspense>
  );
}
