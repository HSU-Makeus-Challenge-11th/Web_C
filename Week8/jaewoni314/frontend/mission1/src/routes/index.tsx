import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
  // 1 이상의 정수가 아닌 page 값은 무시하고 1페이지를 보여 줘요.
  validateSearch: (search): { page?: number } => {
    const page = Number(search.page);
    return { page: Number.isInteger(page) && page > 0 ? page : undefined };
  },
  component: MovieListPage,
});
