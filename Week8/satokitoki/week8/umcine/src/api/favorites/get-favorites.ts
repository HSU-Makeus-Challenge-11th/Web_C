import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface GetFavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite[];
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<GetFavoritesResponse>();
  return response.result;
}
