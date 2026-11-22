"use client";

import { useMutation } from "@tanstack/react-query";
import { signupMutationOptions } from "../queries/mutation-options";

export function useSignupMutation() {
  return useMutation({
    ...signupMutationOptions,
    onSuccess: (response) => {
      alert(response.message);
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
