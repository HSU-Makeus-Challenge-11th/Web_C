import { authApi } from "../auth-api";

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json();
}
