import { authApi } from "../auth-api";

interface RemoveFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

// favoriteId가 아니라 movieId로 해제해요.
export function removeFavorite(movieId: number) {
  return authApi
    .delete(`favorites/${movieId}`)
    .json<RemoveFavoriteResponse>();
}
