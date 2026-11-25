"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isHTTPError } from "ky";
import { useState, type ReactNode } from "react";

const ONE_MINUTE = 60 * 1000;
const MAX_RETRY_COUNT = 3;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 받아 온 데이터를 1분 동안 최신(fresh)으로 취급해서, 같은 화면을 다시 열어도 바로 다시 요청하지 않아요.
        staleTime: ONE_MINUTE,
        // 404처럼 요청 자체가 잘못된 4xx 응답은 다시 보내도 결과가 같아서 재시도하지 않아요.
        retry: (failureCount, error) =>
          !(isHTTPError(error) && error.response.status < 500) && failureCount < MAX_RETRY_COUNT,
      },
    },
  });
}

// QueryClientProvider는 React Context를 쓰므로 Client Component여야 해요.
// Vite에서는 main.tsx의 모듈 최상단에서 QueryClient를 만들었지만, Next.js 서버에서는 모듈이 여러 요청에 공유돼서
// 사용자끼리 캐시가 섞일 수 있어요. 그래서 컴포넌트 안에서 useState로 한 번만 만들어요.
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
