import { authApi } from "./auth/auth-api";

interface ApiResponse<T> {
  result: T;
}

export interface RatingInput {
  score: number;
  comment: string | null;
}

export function createRating(movieId: number, input: RatingInput) {
  return authApi.post("ratings", { json: { movieId, ...input } }).json<ApiResponse<number>>();
}

export function updateRating(ratingId: number, input: RatingInput) {
  return authApi.patch(`ratings/${ratingId}`, { json: input }).json<ApiResponse<unknown>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
