import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../../api/members/signup";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

// 7주차에는 isSubmitting으로 요청 중인지만 직접 관리했어요.
// useMutation은 진행(isPending), 성공(isSuccess, data), 실패(isError, error) 상태를 한 번에 관리해 줘요.
export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      navigate({ to: "/login" });
    },
    onError: (error) => {
      // 실패해도 입력값은 그대로 두어 다시 요청할 수 있어요.
      alert(getApiErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
