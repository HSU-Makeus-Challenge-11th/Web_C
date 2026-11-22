import { MovieDetailPage } from "../../../screens/movies/movieDetailPage";

export default async function Page({ params }: { params: Promise<{ movieId: string }> }) {
  const { movieId } = await params;
  return <MovieDetailPage movieIdParam={movieId} />;
}
