import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  type CreateRatingRequest,
} from "../api/ratings/create-rating";
import {
  updateRating,
  type UpdateRatingRequest,
} from "../api/ratings/update-rating";
import { deleteRating } from "../api/ratings/delete-rating";

export function useRatingMutations(memberId?: number) {
  const queryClient = useQueryClient();

  const invalidateRatings = () => {
    if (memberId) {
      queryClient.invalidateQueries({
        queryKey: ["members", memberId, "ratings"],
      });
    }
  };

  const createMutation = useMutation({
    mutationFn: (body: CreateRatingRequest) => createRating(body),
    onSuccess: () => {
      invalidateRatings();
      alert("평점이 등록되었어요.");
    },
    onError: () => alert("평점 등록에 실패했어요."),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      ratingId,
      body,
    }: {
      ratingId: number;
      body: UpdateRatingRequest;
    }) => updateRating(ratingId, body),
    onSuccess: () => {
      invalidateRatings();
      alert("평점이 수정되었어요.");
    },
    onError: () => alert("평점 수정에 실패했어요."),
  });

  const deleteMutation = useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: () => {
      invalidateRatings();
      alert("평점이 삭제되었어요.");
    },
    onError: () => alert("평점 삭제에 실패했어요."),
  });

  return { createMutation, updateMutation, deleteMutation };
}
