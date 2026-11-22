import { authApi } from "../auth-api";
import type { Rating } from "./get-ratings";

export interface CreateRatingBody {
  movieId: number;
  score: number;
  comment?: string;
}

interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export function createRating(body: CreateRatingBody) {
  return authApi
    .post("ratings", { json: body })
    .json<CreateRatingResponse>();
}