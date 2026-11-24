"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const ONE_MINUTE = 60 * 1000;

export function QueryProvider({ children }: { children: ReactNode }) {
  // 요청마다 새 QueryClient가 만들어지지 않도록 useState로 한 번만 만들어요.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } }, // 모든 query의 기본 staleTime: 1분
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
