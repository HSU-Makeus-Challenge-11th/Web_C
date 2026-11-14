import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
  type CreateRatingRequest,
} from "../api/ratings/ratings";
import { useAuthStore } from "../stores/auth-store";

// 미션 7: 평점 훅 모음

// 캐시 이름표
export const ratingKeys = {
  all: ["ratings"] as const, // 평점 관련 전부 (갱신할 때 한 번에 지정하려고)
  mine: (memberId: number | undefined) => ["ratings", "member", memberId] as const,
};

// 1) 내 평점 전부 — 내 정보에서 memberId를 꺼낸 다음 조회
export function useMyRatingsQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 내 정보 (헤더·마이페이지와 같은 이름표라 캐시를 같이 씀)
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const memberId = meQuery.data?.memberId; // 내 정보가 있으면 memberId, 없으면 undefined

  return useQuery({
    queryKey: ratingKeys.mine(memberId),
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== undefined, // memberId를 알게 된 다음에만 조회
  });
}

// 2) 평점 등록
export function useCreateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateRatingRequest) => createRating(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.all }); // 내 평점 목록 다시 받아오기
      alert("평점을 등록했어요.");
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

// 3) 평점 수정 (어느 평점인지 ratingId + 새 별점·한줄평)
export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { ratingId: number; score: number; comment: string }) =>
      updateRating(variables.ratingId, {
        score: variables.score,
        comment: variables.comment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.all });
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

// 4) 평점 삭제
export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingKeys.all });
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}