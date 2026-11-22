import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";
import { getApiErrorMessage } from "../utils/api/get-api-error-message";
import { useMemberId } from "./use-member-id";

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: addFavorite,
    onError: async (error) => {
      alert(await getApiErrorMessage(error, "즐겨찾기 등록에 실패했어요."));
    },
    // 목록과 여부 조회가 모두 ["favorites", memberId] 아래에 있어서 한 번에 갱신돼요.
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["favorites", memberId] }),
  });
}
