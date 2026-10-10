import { createRootRoute } from "@tanstack/react-router";
import { RootLayout } from "../components/root-layout";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-14">
      페이지를 찾을 수 없어요.
    </main>
  ),
});

