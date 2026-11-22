import { Suspense } from "react";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

// 주소: /movies/영화id (예: /movies/123)
// 영화 id는 요청이 와야 알 수 있으므로 Suspense 안에서 읽음 (워크북 2.4 방식)
export default function Page({ params }: MovieDetailRouteProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-20">
          <h1 className="text-2xl font-bold">영화 정보를 불러오는 중이에요...</h1>
        </main>
      }
    >
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

async function MovieDetailScreen({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;

  return <MovieDetailPage movieIdParam={movieId} />;
}
