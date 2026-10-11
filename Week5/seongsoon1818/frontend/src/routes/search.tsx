import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/searchPage";
import { parseMoviePage } from "../utils/movies/movie-page";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string; page?: number } => {
    const rawQuery = search.query;
    const query =
      typeof rawQuery === "string" || typeof rawQuery === "number"
        ? String(rawQuery).trim()
        : "";
    const page = parseMoviePage(search.page);

    // 생략하면 원래 search 값이 남을 수 있으므로 보정한 값을 명시합니다.
    return { query: query || undefined, page };
  },
  component: SearchPage,
});
