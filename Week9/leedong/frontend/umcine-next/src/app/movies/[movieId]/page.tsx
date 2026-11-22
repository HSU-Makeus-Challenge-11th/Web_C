import { MovieDetailPage } from "@/views/movies/movie-detail-page";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

export default async function Page({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;

  return <MovieDetailPage movieId={movieId} />;
}
