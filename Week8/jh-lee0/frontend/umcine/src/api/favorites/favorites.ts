import { authApi } from "../auth-api";

// 미션 3: 즐겨찾기 API 함수 모음 (모두 로그인 필요 → authApi 사용)

// 즐겨찾기 하나의 모양 (백엔드 FavoriteResponse와 같음)
export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

// 서버 응답 모양들 (공통 형식 isSuccess, code, message + result)
interface FavoriteListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite[]; // 즐겨찾기 배열
}

interface FavoriteStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { isFavorite: boolean };
}

interface FavoriteCreateResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite;
}

interface FavoriteDeleteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

// GET /favorites — 내 즐겨찾기 목록
export async function getMyFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<FavoriteListResponse>();
  return response.result;
}

// GET /favorites/{movieId} — 이 영화를 즐겨찾기 했는지 (true / false)
export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<FavoriteStatusResponse>();
  return response.result.isFavorite;
}

// POST /favorites — 즐겨찾기 추가
export function addFavorite(movieId: number) {
  return authApi
    .post("favorites", { json: { movieId } })
    .json<FavoriteCreateResponse>();
}

// DELETE /favorites/{movieId} — 즐겨찾기 해제
export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<FavoriteDeleteResponse>();
}