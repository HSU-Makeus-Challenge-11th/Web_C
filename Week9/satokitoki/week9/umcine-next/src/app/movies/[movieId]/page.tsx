import { Suspense } from "react";
import type { Metadata } from "next";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

export const metadata: Metadata = {
  title: "영화 상세 | UMCine",
};

export default function Page({ params }: MovieDetailRouteProps) {
  return (
    <Suspense
      fallback={<main className="flex-1 px-20 py-32 text-center text-lg text-gray-500">영화 상세 정보를 불러오는 중이에요.</main>}
    >
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

// 서버에서 URL의 movieId를 읽고, 화면(Client Component)에 넘겨줘요.
async function MovieDetailScreen({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
