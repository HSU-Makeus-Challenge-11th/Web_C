import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";
import { removeFavorite } from "../api/favorites/remove-favorite";
import type { FavoriteStatus } from "../api/favorites/get-favorite-status";

export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    // 지금 즐겨찾기 상태라면 해제, 아니라면 등록
    mutationFn: (isFavorite: boolean) =>
      isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: (_data, isFavorite: boolean) => {
      // 이 영화의 즐겨찾기 여부는 결과를 알고 있으니 캐시를 바로 바꿉니다
      queryClient.setQueryData<FavoriteStatus>(["favorites", movieId], {
        isFavorite: !isFavorite,
      });
      // 마이페이지 목록은 다음에 볼 때 다시 불러오도록 무효화합니다
      queryClient.invalidateQueries({ queryKey: ["favorites"], exact: true });
    },
    onError: () => {
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });
}
