import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { getApiErrorMessage } from "../utils/api/get-api-error-message";
import { useMemberId } from "./use-member-id";

export function useCreateRatingMutation() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: createRating,
    onError: async (error) => {
      alert(await getApiErrorMessage(error, "평점 등록에 실패했어요."));
    },
    // 성공하든 실패하든(예: 이미 등록한 영화) 서버의 최신 목록으로 다시 맞춰요.
    // Promise를 돌려주면 다시 조회가 끝날 때까지 mutation이 진행 중으로 유지돼요.
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["ratings", memberId] }),
  });
}
