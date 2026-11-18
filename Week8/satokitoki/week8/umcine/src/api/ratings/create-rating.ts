import { authApi } from "../auth-api";
import type { RatingResponse } from "./types";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<RatingResponse>();
}
