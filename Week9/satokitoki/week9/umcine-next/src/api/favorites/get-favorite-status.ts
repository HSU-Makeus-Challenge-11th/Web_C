import { authApi } from "../auth-api";

export interface FavoriteStatus {
  isFavorite: boolean;
}

interface GetFavoriteStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteStatus;
}

export async function getFavoriteStatus(
  movieId: number,
): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<GetFavoriteStatusResponse>();
  return response.result;
}
