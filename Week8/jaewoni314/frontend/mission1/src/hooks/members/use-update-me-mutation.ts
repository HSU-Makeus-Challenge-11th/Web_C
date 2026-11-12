import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { memberQueries } from "../../api/members/member-queries";
import { updateMe } from "../../api/members/update-me";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedMe) => {
      // 응답에 수정된 내 정보 전체가 담겨 오므로, 다시 조회(invalidateQueries)하지 않고 캐시를 바로 바꿔요(setQueryData).
      // 같은 key를 쓰는 헤더와 마이페이지에 추가 요청 없이 새 닉네임이 바로 보여요.
      queryClient.setQueryData(memberQueries.me().queryKey, updatedMe);
      alert("내 정보를 수정했어요.");
      navigate({ to: "/my" });
    },
    onError: (error) => {
      // 중복 확인 뒤 다른 회원이 같은 닉네임을 먼저 쓰면 409(MEMBER409_1)가 와요.
      alert(getApiErrorMessage(error, "내 정보 수정에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
