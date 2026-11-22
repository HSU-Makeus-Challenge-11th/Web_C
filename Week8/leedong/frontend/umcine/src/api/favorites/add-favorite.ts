import { authApi } from "../auth-api";
import type { Favorite } from "./get-favorites";

interface AddFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite;
}

export function addFavorite(movieId: number) {
  return authApi
    .post("favorites", { json: { movieId } })
    .json<AddFavoriteResponse>();
}
