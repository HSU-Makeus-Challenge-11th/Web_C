import { authApi } from "../auth-api";

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json();
}
