"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";

const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: ReactNode }) {
  // QueryClient는 브라우저에서 한 번만 만들어요.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  // 화면이 브라우저에 뜬 뒤 localStorage에 저장된 값을 불러와요.
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useBookmarkStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
