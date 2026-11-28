import { authApi } from "../auth-api";

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json();
}
