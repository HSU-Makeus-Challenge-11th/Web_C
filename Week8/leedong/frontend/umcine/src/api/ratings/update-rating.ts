import { authApi } from "../auth-api";
import type { Rating } from "./get-ratings";

export interface UpdateRatingVariables {
  ratingId: number;
  score: number;
  comment: string;
}

interface UpdateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

// PATCH지만 comment를 빼면 기존 후기가 null로 덮여요. 항상 score와 comment를 함께 보내요.
export function updateRating({ ratingId, score, comment }: UpdateRatingVariables) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: { score, comment } })
    .json<UpdateRatingResponse>();
}
