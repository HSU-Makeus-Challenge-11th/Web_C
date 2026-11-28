import { authApi } from "../auth-api";

interface GetFavoriteStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { isFavorite: boolean } | boolean;
}

export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<GetFavoriteStatusResponse>();

  if (typeof response.result === "boolean") {
    return response.result;
  }
  return Boolean(response.result?.isFavorite);
}
