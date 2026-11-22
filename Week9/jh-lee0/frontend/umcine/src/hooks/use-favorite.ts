import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavoriteStatus,
  getMyFavorites,
  removeFavorite,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

// 미션 4: 즐겨찾기 훅 모음

// 캐시 이름표 (여러 곳에서 똑같이 써야 해서 한 곳에 모아 둠)
export const favoriteKeys = {
  list: ["favorites", "list"] as const,
  status: (movieId: number) => ["favorites", "status", movieId] as const,
};

// 1) 내 즐겨찾기 목록 (GET /favorites) — 미션 6 마이페이지에서 사용
export function useMyFavoritesQuery() {
  return useQuery({
    queryKey: favoriteKeys.list,
    queryFn: getMyFavorites,
  });
}

// 2) 이 영화를 즐겨찾기 했는지 (GET /favorites/{movieId}) — 미션 5 버튼 모양
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken), // 로그인 안 했으면 아예 안 물어봄 (헤더와 같은 방식)
  });
}

// 3) 즐겨찾기 추가/해제 (POST 또는 DELETE) — 미션 5 버튼 클릭
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    // 지금 즐겨찾기 상태를 받아서: 했으면 해제, 안 했으면 추가
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
      return !isFavorite; // 바뀐 뒤의 상태를 돌려줌 (추가했으면 true, 해제했으면 false)
    },
    onSuccess: (newIsFavorite) => {
      // ① 여부: 결과를 이미 아니까 캐시를 바로 덮어씀 (setQueryData, 3.1 방식) → 재요청 없음
      queryClient.setQueryData(favoriteKeys.status(movieId), newIsFavorite);
      // ② 목록: 낡았다고만 표시 (invalidateQueries, 2.4 방식) → 마이페이지 열 때 새로 받음
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list });
    },
    onError: () => {
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });
}