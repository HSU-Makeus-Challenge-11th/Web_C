import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isHTTPError } from "ky";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const ONE_MINUTE = 60 * 1000;
const MAX_RETRY_COUNT = 3;

const router = createRouter({ routeTree });
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 받아 온 데이터를 1분 동안 최신(fresh)으로 취급해서, 같은 화면을 다시 열어도 바로 다시 요청하지 않아요.
      staleTime: ONE_MINUTE,
      // 404처럼 요청 자체가 잘못된 4xx 응답은 다시 보내도 결과가 같아서 재시도하지 않아요.
      // 기본값(3번 재시도)대로 두면 없는 영화의 상세 화면에서 요청이 4번 나가고, 8초 넘게 로딩 문구만 보였어요.
      retry: (failureCount, error) =>
        !(isHTTPError(error) && error.response.status < 500) && failureCount < MAX_RETRY_COUNT,
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
