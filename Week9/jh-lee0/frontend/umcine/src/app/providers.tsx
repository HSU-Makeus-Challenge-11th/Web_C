"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";

// staleTime과 gcTime으로 캐시에 저장된 데이터 관리
// staleTime은 데이터 받아온 직후 시작, gcTime은 데이터를 사용하는 화면이 없어진 후 부터 시작
// staleTime이 지나면 해당 데이터는 오래된 데이터라 판단하고 다시 서버에 요청
// gcTime은 데이터를 아무데서도 사용하지 않을 때 캐시에서 해당 데이터를 삭제하기 까지의 유예기간
const ONE_MINUTE = 60 * 1000;

export function Providers({ children }: { children: ReactNode }) {
  // 서버 데이터 저장소
  // QueryClient는 서버에서 받아온 데이터를 보관/관리하는 관리자
  // useState로 만들어서 화면이 다시 그려져도 같은 QueryClient를 계속 사용
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  // 9주차: 브라우저에서 화면이 뜬 직후에 localStorage의 토큰·북마크를 읽어옴
  // (서버에는 localStorage가 없어서, 처음부터 읽으면 서버 화면과 브라우저 화면이 달라짐)
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useBookmarkStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
