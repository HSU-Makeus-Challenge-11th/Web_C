import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";
import { isHTTPError } from "ky";

type GetMovieDetailResponse = TmdbMovieDetail;

function getMovieDetail(movieId: number) {
  return tmdbClient
    .get(`movie/${movieId}`, {
      searchParams: { language: "ko-KR" },
    })
    .json<GetMovieDetailResponse>();
}

export function getMovieDetailErrorMessage(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) {
    return "영화를 찾을 수 없어요.";
  }

  return "영화 정보를 불러오지 못했어요.";
}

export { getMovieDetail, type GetMovieDetailResponse };
