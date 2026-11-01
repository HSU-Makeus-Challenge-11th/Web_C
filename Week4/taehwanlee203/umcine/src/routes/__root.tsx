import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
<<<<<<<< Updated upstream:Week3/jaewoni314/frontend/mission1/src/routes/__root.tsx
import { Footer } from "../components/layout/footer";
========
import Pagination from "../components/movies/pagination";
>>>>>>>> Stashed changes:Week4/taehwanlee203/umcine/src/routes/__root.tsx

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
<<<<<<<< Updated upstream:Week3/jaewoni314/frontend/mission1/src/routes/__root.tsx
      <Footer />
========
      <Pagination />
>>>>>>>> Stashed changes:Week4/taehwanlee203/umcine/src/routes/__root.tsx
    </>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[1200px] px-6 py-20 text-center text-muted">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
