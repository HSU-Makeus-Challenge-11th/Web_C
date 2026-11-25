import type { Metadata } from "next";
import { Suspense } from "react";
import { getMovieSummaryOnServer } from "@/api/movies/get-movie-title-on-server";
import { StatusMessage } from "@/components/movies/status-message";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

// 8주차 routes/movies.$movieId.tsx → app/movies/[movieId]/page.tsx (/movies/550)
// TanStack Router의 $movieId가 Next.js에서는 [movieId] 폴더예요.

// 탭 제목과 링크 공유 미리보기(Open Graph)에 영화 제목, 줄거리, 포스터를 넣어요.
// 메타데이터는 HTML의 <head>에 들어가야 해서 브라우저가 아니라 서버에서 TMDB를 조회해요.
export async function generateMetadata({ params }: PageProps<"/movies/[movieId]">): Promise<Metadata> {
  const { movieId } = await params;
  const id = Number(movieId);
  const movie = Number.isInteger(id) && id > 0 ? await getMovieSummaryOnServer(id) : null;
  if (!movie) return { title: "영화 정보를 찾을 수 없어요" };

  const posterUrl = getTmdbPosterUrl(movie.posterPath);
  return {
    title: movie.title,
    description: movie.overview || `${movie.title}의 정보와 평점`,
    openGraph: {
      title: `${movie.title} | UMCine`,
      description: movie.overview || `${movie.title}의 정보와 평점`,
      images: posterUrl ? [posterUrl] : [],
    },
  };
}

export default function Page({ params }: PageProps<"/movies/[movieId]">) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-[1200px] px-6">
          <StatusMessage>영화 정보를 불러오는 중이에요.</StatusMessage>
        </main>
      }
    >
      <MovieDetail params={params} />
    </Suspense>
  );
}

// params는 요청을 받아야 알 수 있는 값이라, await params가 Suspense 경계 안에서 실행되도록 컴포넌트를 나눴어요.
async function MovieDetail({ params }: Pick<PageProps<"/movies/[movieId]">, "params">) {
  const { movieId } = await params;
  // 즐겨찾기, 평점처럼 로그인 상태와 상호작용이 필요한 화면은 Client Component에 맡기고 movieId만 넘겨요.
  return <MovieDetailPage movieId={movieId} />;
}
