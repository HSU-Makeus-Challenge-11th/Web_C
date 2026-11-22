import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRating } from "../api/ratings/delete-rating";
import { getApiErrorMessage } from "../utils/api/get-api-error-message";
import { useMemberId } from "./use-member-id";

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: deleteRating,
    onError: async (error) => {
      alert(await getApiErrorMessage(error, "평점 삭제에 실패했어요."));
    },
    // 삭제 응답의 result는 null이라 어떤 데이터가 남았는지 알 수 없어요. 다시 조회해요.
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["ratings", memberId] }),
  });
}
