import { authApi } from "../auth-api";

export interface FavoriteItem {
  favoriteId?: number;
  id?: number;
  movieId: number;
  createdAt?: string;
}

interface GetFavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteItem[];
}

export async function getFavorites(): Promise<FavoriteItem[]> {
  const response = await authApi.get("favorites").json<GetFavoritesResponse>();
  return response.result ?? [];
}
