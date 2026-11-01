import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });
const ONE_MINUTE = 60 * 1000;
// 렌더링마다 캐시가 초기화되지 않도록 QueryClient를 한 번만 생성해요.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 성공한 데이터는 1분 동안 fresh 상태로 재사용해요.
      staleTime: ONE_MINUTE,
      // 화면을 떠난 뒤 사용하지 않는 캐시는 5분 동안 보관해요.
      gcTime: 5 * ONE_MINUTE,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
);
