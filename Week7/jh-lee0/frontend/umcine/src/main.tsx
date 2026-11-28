import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

// staleTime과 gcTime으로 캐시에 저장된 데이터 관리
// staleTime은 데이터 받아온 직후 시작, gcTime은 데이터를 사용하는 화면이 없어진 후 부터 시작
// staleTime이 지나면 해당 데이터는 오래된 데이터라 판단하고 다시 서버에 요청
// gcTime은 데이터를 아무데서도 사용하지 않을 때 캐시에서 해당 데이터를 삭제하기 까지의 유예기간
const ONE_MINUTE = 60 * 1000;
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: ONE_MINUTE } },
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