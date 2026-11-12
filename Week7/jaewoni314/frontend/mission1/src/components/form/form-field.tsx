import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../utils/cn";

type FormFieldIcon = "mail" | "lock" | "person";
type FormFieldMessageTone = "error" | "success" | "info";

interface FormFieldProps extends Omit<ComponentProps<"input">, "id"> {
  label: string;
  icon: FormFieldIcon;
  message?: string;
  messageTone?: FormFieldMessageTone;
  // 입력창 오른쪽에 붙는 버튼이에요. (예: 중복 확인)
  action?: ReactNode;
}

const MESSAGE_TONE_CLASS: Record<FormFieldMessageTone, string> = {
  error: "text-red-400",
  success: "text-emerald-400",
  info: "text-muted",
};

// 라벨, 아이콘이 있는 입력창과 안내 문구를 한 묶음으로 보여 줘요.
export function FormField({
  label,
  icon,
  message,
  messageTone = "info",
  action,
  className,
  ...inputProps
}: FormFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const isError = Boolean(message) && messageTone === "error";
  const isSuccess = Boolean(message) && messageTone === "success";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <span
            className={cn(
              "icon pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted",
              `icon--${icon}`,
            )}
            aria-hidden="true"
          />
          <input
            id={id}
            className={cn(
              "h-12 w-full rounded-lg border border-line bg-surface pl-11 pr-4 text-[15px] placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60",
              isError && "border-red-400",
              isSuccess && "border-emerald-400/70",
              className,
            )}
            aria-invalid={isError || undefined}
            aria-describedby={message ? messageId : undefined}
            {...inputProps}
          />
        </div>
        {action}
      </div>
      {message && (
        <p id={messageId} className={cn("text-[13px]", MESSAGE_TONE_CLASS[messageTone])}>
          {message}
        </p>
      )}
    </div>
  );
}
