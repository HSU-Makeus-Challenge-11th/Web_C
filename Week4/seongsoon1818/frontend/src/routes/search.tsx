import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/searchPage";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string } => {
    const rawQuery = search.query;

    const query =
      typeof rawQuery === "string" || typeof rawQuery === "number"
        ? String(rawQuery).trim()
        : "";

    return query ? { query } : {};
  },
  component: SearchPage,
});