import { authApi } from "../auth-api";
import type { RatingResponse } from "./types";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string | null;
}

export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingResponse>();
}
