import { Suspense } from "react";
import { StatusMessage } from "@/components/movies/status-message";
import { MovieListPage } from "@/screens/movies/movie-list-page";

// 8주차 routes/index.tsx → app/page.tsx (/)
// 이 파일은 Server Component예요. 페이지 번호를 URL(?page=)에서 읽는 MovieListPage는 Client Component라서,
// Cache Components 설정에서는 useSearchParams를 쓰는 부분을 Suspense로 감싸야 나머지(헤더, 푸터)를 미리 HTML로 만들 수 있어요.
export default function HomePage() {
  return (
    <Suspense fallback={<MovieListFallback />}>
      <MovieListPage />
    </Suspense>
  );
}

function MovieListFallback() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16 pt-12">
      <h1 className="text-[32px] font-bold tracking-[-0.02em]">인기 영화</h1>
      <StatusMessage>영화 목록을 불러오는 중이에요.</StatusMessage>
    </main>
  );
}
