interface RequestErrorProps {
  message: string;
  onRetry: () => void;
}

export function RequestError({ message, onRetry }: RequestErrorProps) {
  return (
    <div className="space-y-4">
      <p role="alert" className="text-red-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#226fd1]"
      >
        다시 시도
      </button>
    </div>
  );
}
