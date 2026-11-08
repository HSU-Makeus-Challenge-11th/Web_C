import { useState } from "react";
import type { CheckResponse } from "../../api/members/models";

export type DuplicateCheckStatus = "idle" | "checking" | "available" | "unavailable";

// 어떤 값을 확인한 결과인지 함께 저장해요.
interface DuplicateCheckResult {
  value: string;
  status: DuplicateCheckStatus;
}

// 이메일, 닉네임 중복 확인의 요청 상태와 결과를 관리해요.
// 회원가입과 내 정보 수정 화면에서 같이 써요.
export function useDuplicateCheck(
  request: (value: string) => Promise<CheckResponse>,
  label: string,
) {
  const [result, setResult] = useState<DuplicateCheckResult | null>(null);

  // 확인한 값과 지금 입력한 값이 다르면 이전 결과를 쓰지 않아요.
  // 값을 바꾸면 자동으로 "idle"이 되어 다시 확인해야 해요.
  const getStatus = (value: string): DuplicateCheckStatus =>
    result?.value === value ? result.status : "idle";

  const check = async (value: string) => {
    if (result?.status === "checking") return;

    setResult({ value, status: "checking" });
    try {
      const { available } = await request(value);
      setResult({ value, status: available ? "available" : "unavailable" });
      alert(available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setResult(null);
      alert(`${label} 중복 확인에 실패했어요. 다시 시도해 주세요.`);
    }
  };

  // 서버에서 중복으로 막혔을 때처럼, 확인 결과를 더 믿을 수 없으면 지워서 다시 확인하게 해요.
  const reset = () => setResult(null);

  return { getStatus, check, reset };
}

// 중복 확인 상태를 입력창 아래 안내 문구로 바꿔요. FormField에 그대로 펼쳐 넘길 수 있어요.
export function getDuplicateCheckMessage(status: DuplicateCheckStatus, label: string) {
  switch (status) {
    case "idle":
      return { message: "중복 확인을 해 주세요.", messageTone: "info" } as const;
    case "checking":
      return { message: "확인하는 중이에요.", messageTone: "info" } as const;
    case "available":
      return { message: `사용할 수 있는 ${label}이에요.`, messageTone: "success" } as const;
    case "unavailable":
      return { message: `이미 사용 중인 ${label}이에요.`, messageTone: "error" } as const;
  }
}
