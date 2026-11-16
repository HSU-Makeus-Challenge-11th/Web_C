import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingQueries } from "../../api/ratings/rating-queries";
import { ratingMutations } from "../../api/ratings/rating-mutations";
import { getMemberIdFromToken, useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

// 토큰의 sub(회원 ID)로 "내 평점 목록" query key를 만들어요.
export function useMyMemberId() {
  return useAuthStore((state) => getMemberIdFromToken(state.accessToken));
}

// 평점 등록/수정/삭제 후에는 invalidateQueries로 내 평점 목록을 다시 조회해요.
// 목록은 최신순 정렬이고, 같은 목록을 마이페이지와 영화 상세가 함께 쓰므로
// 캐시를 직접 고치기보다 서버가 정렬해 준 결과를 다시 받는 쪽이 단순하고 안전해요. (요청이 한 번 더 나가요.)
function useInvalidateMyRatings() {
  const queryClient = useQueryClient();
  const memberId = useMyMemberId();

  return () =>
    memberId
      ? queryClient.invalidateQueries({ queryKey: ratingQueries.byMember(memberId).queryKey })
      : Promise.resolve();
}

export function useCreateRatingMutation() {
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    ...ratingMutations.create(),
    // onSuccess에서 Promise를 돌려주면, 다시 조회가 끝날 때까지 isPending이 유지돼요.
    // 그래서 "등록 중" 표시가 끝나는 순간 화면에 새 평점이 이미 보여요.
    onSuccess: () => invalidateMyRatings(),
    onError: (error) => {
      // 다른 탭에서 이미 평점을 남겼다면 409(RATING409_1)예요. 목록을 다시 받아 남긴 평점을 보여 줘요.
      alert(getApiErrorMessage(error, "평점을 등록하지 못했어요. 다시 시도해 주세요."));
      void invalidateMyRatings();
    },
  });
}

export function useUpdateRatingMutation() {
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    ...ratingMutations.update(),
    onSuccess: () => invalidateMyRatings(),
    onError: (error) => {
      alert(getApiErrorMessage(error, "평점을 수정하지 못했어요. 다시 시도해 주세요."));
      void invalidateMyRatings();
    },
  });
}

export function useDeleteRatingMutation() {
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    ...ratingMutations.remove(),
    onSuccess: () => invalidateMyRatings(),
    onError: (error) => {
      alert(getApiErrorMessage(error, "평점을 삭제하지 못했어요. 다시 시도해 주세요."));
      void invalidateMyRatings();
    },
  });
}
