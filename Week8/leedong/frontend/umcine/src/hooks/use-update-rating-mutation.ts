import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRating } from "../api/ratings/update-rating";
import type { Rating } from "../api/ratings/get-ratings";
import { getApiErrorMessage } from "../utils/api/get-api-error-message";
import { useMemberId } from "./use-member-id";

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: updateRating,
    // 수정 응답에 바뀐 평점이 통째로 담겨 있어서, 다시 조회하지 않고 캐시의 해당 항목만 교체해요.
    onSuccess: (response) => {
      queryClient.setQueryData<Rating[]>(["ratings", memberId], (ratings) =>
        ratings?.map((rating) =>
          rating.ratingId === response.result.ratingId ? response.result : rating,
        ),
      );
    },
    onError: async (error) => {
      alert(await getApiErrorMessage(error, "평점 수정에 실패했어요."));
    },
  });
}
