import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe, type UpdateMeResponse } from "../api/members/update-me";
import type { MemberInfo } from "../api/members/me";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response: UpdateMeResponse) => {
      // 다시 조회하지 않고, 응답으로 받은 최신 정보를 캐시에 바로 넣습니다
      queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
