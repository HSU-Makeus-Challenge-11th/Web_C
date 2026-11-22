import { SearchPage } from "../../screens/movies/searchPage";
import { parseMoviePage } from "../../utils/movies/movie-page";

export default async function Page({ searchParams }: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const { query, page } = await searchParams;
  return <SearchPage query={typeof query === "string" ? query.trim() : ""} page={parseMoviePage(page)} />;
}
