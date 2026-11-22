import { useMutation } from "@tanstack/react-query";
import { signup, type SignupResponse } from "../api/members/signup";

export function useSignupMutation() {
  return useMutation({
    // 실제로 요청을 보내는 함수
    mutationFn: signup,
    // 요청이 성공했을 때
    onSuccess: (response: SignupResponse) => {
      alert(response.message);
    },
    // 요청이 실패했을 때
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
