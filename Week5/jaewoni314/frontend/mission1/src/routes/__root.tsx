import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[1200px] px-6 py-20 text-center text-muted">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
