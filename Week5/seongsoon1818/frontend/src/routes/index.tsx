import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movieListPage";
import { parseMoviePage } from "../utils/movies/movie-page";

export const Route = createFileRoute("/")({
  validateSearch: (search): { page?: number } => {
    const page = parseMoviePage(search.page);
    return { page };
  },
  component: MovieListPage,
});
