import { authApi } from "../auth-api";
import type { ApiResponse } from "../members/models";

interface Favorite {
  favoriteId: number;
  // TMDB 영화 ID
  movieId: number;
  createdAt: string;
}

interface FavoriteStatus {
  isFavorite: boolean;
}

// 즐겨찾기는 모두 로그인한 회원의 데이터라서 authApi로 요청해요. memberId는 보내지 않고 서버가 토큰으로 알아내요.

// GET /favorites: 내 즐겨찾기 목록 (최근에 등록한 순서)
async function getFavorites() {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}

// GET /favorites/{movieId}: 이 영화가 내 즐겨찾기인지
async function getFavoriteStatus(movieId: number) {
  const response = await authApi.get(`favorites/${movieId}`).json<ApiResponse<FavoriteStatus>>();
  return response.result;
}

// POST /favorites: 즐겨찾기 등록. 이미 등록한 영화면 409(FAVORITE409_1)
async function addFavorite(movieId: number) {
  const response = await authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
  return response.result;
}

// DELETE /favorites/{movieId}: 즐겨찾기 해제. 등록하지 않은 영화면 404(FAVORITE404_1)
async function removeFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}

export { addFavorite, getFavorites, getFavoriteStatus, removeFavorite };
export type { Favorite, FavoriteStatus };
