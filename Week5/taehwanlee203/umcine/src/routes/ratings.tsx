import { createFileRoute } from "@tanstack/react-router";
import { RatingsPage } from "../pages/movies/ratings-page"; // 실제 ratings-page 위치

export const Route = createFileRoute("/ratings")({
  component: RatingsPage,
});
