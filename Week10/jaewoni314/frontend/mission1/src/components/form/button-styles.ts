import { cn } from "../../utils/cn";

// 폼 화면에서 같이 쓰는 버튼 스타일이에요.
export const primaryButtonClass =
  "h-12 w-full rounded-lg bg-accent text-[15px] font-bold text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted disabled:opacity-100";

export const secondaryButtonClass =
  "inline-flex h-12 shrink-0 items-center justify-center rounded-lg border border-line px-4 text-sm font-semibold hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

// "중복 확인" ↔ "확인 중"으로 문구가 바뀌어도 입력창 너비가 흔들리지 않게 폭을 고정해요.
export const duplicateCheckButtonClass = cn(secondaryButtonClass, "w-[92px] px-0");
