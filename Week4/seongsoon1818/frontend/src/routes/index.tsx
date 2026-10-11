import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movieListPage";

export const Route = createFileRoute("/")({
  component: MovieListPage,
});