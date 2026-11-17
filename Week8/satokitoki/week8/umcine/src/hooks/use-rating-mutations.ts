import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { updateRating } from "../api/ratings/update-rating";
import { deleteRating } from "../api/ratings/delete-rating";

// 등록, 수정, 삭제 모두 성공하면 평점 목록을 다시 불러옵니다
function useInvalidateRatings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["ratings"] });
}

export function useCreateRatingMutation() {
  const invalidateRatings = useInvalidateRatings();
  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      invalidateRatings();
      alert("평점을 등록했어요.");
    },
    onError: () => alert("평점 등록에 실패했어요. 다시 시도해 주세요."),
  });
}

export function useUpdateRatingMutation() {
  const invalidateRatings = useInvalidateRatings();
  return useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      invalidateRatings();
      alert("평점을 수정했어요.");
    },
    onError: () => alert("평점 수정에 실패했어요. 다시 시도해 주세요."),
  });
}

export function useDeleteRatingMutation() {
  const invalidateRatings = useInvalidateRatings();
  return useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      invalidateRatings();
      alert("평점을 삭제했어요.");
    },
    onError: () => alert("평점 삭제에 실패했어요. 다시 시도해 주세요."),
  });
}
