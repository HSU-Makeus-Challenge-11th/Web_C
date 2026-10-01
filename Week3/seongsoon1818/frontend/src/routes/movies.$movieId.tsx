import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailPage } from "../pages/movies/movieDetailPage";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailPage,
});