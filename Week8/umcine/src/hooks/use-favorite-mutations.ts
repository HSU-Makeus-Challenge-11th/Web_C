import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";
import { removeFavorite } from "../api/favorites/remove-favorite";

export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isCurrentlyFavorite: boolean) => {
      if (isCurrentlyFavorite) {
        return removeFavorite(movieId);
      }
      return addFavorite(movieId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", movieId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 처리에 실패했어요. 로그인 상태를 확인해 주세요.");
    },
  });
}
