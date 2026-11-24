import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { getApiErrorMessage } from "../utils/api/get-api-error-message";
import { useMemberId } from "./use-member-id";

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: removeFavorite,
    onError: async (error) => {
      alert(await getApiErrorMessage(error, "즐겨찾기 해제에 실패했어요."));
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["favorites", memberId] }),
  });
}
