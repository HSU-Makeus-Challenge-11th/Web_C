import { MovieListPage } from "../screens/movies/movieListPage";
import { parseMoviePage } from "../utils/movies/movie-page";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  return <MovieListPage page={parseMoviePage(page)} />;
}
