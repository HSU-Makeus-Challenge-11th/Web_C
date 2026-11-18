import { authApi } from "../auth-api";

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json();
}
