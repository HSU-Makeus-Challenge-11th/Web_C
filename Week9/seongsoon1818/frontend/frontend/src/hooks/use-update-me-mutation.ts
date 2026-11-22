"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberInfo } from "../api/members/me";
import { updateMeMutationOptions } from "../queries/mutation-options";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateMeMutationOptions,
    onSuccess: (response) => {
      queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
