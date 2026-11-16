import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authMutations } from "../../api/auth/auth-mutations";
import { memberQueries } from "../../api/members/member-queries";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    ...authMutations.login(),
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert(`${response.result.nickname}님, 로그인에 성공했어요.`);
      // 다른 회원으로 로그인했을 수 있으니 이전 내 정보 캐시를 낡은 것으로 표시해서 새 토큰으로 다시 조회해요.
      queryClient.invalidateQueries({ queryKey: memberQueries.me().queryKey });
      navigate({ to: "/" });
    },
    onError: (error) => {
      // 이메일이 없거나 비밀번호가 틀리면 서버가 같은 401 메시지로 알려 줘요.
      alert(getApiErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
