import { authApi } from "./auth/auth-api";

interface ApiResponse<T> {
  result: T;
}

export interface Favorite {
  favoriteId: number;
  movieId: number;
}

export async function getFavorites() {
  return (await authApi.get("favorites").json<ApiResponse<Favorite[]>>()).result;
}

export async function getFavorite(movieId: number) {
  return (await authApi.get(`favorites/${movieId}`).json<ApiResponse<{ isFavorite: boolean }>>()).result.isFavorite;
}

export async function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}

export async function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
