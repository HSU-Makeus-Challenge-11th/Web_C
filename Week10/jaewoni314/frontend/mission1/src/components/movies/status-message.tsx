interface StatusMessageProps {
  children: string;
  isError?: boolean;
}

// 로딩, 오류, 빈 결과 문구를 같은 위치와 크기로 보여 줘요.
export function StatusMessage({ children, isError = false }: StatusMessageProps) {
  return (
    <p
      className={isError ? "py-20 text-center text-red-400" : "py-20 text-center text-muted"}
      role={isError ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
