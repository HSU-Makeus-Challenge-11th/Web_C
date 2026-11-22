import { Suspense } from "react";
import { SearchPage } from "../../views/movies/search-page";

export default function SearchRoutePage() {
  return (
    <Suspense fallback={<div>검색 페이지 로딩 중...</div>}>
      <SearchPage />
    </Suspense>
  );
}
