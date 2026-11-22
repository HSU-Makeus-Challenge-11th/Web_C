import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex flex-1 flex-col">
        <Outlet /> 
        {/* Outlet 여기에 자식 페이지가 들어감, 어느 주소로 가든 여기만 컴포넌트를 바꿔 끼는 것! */}
      </div>  
      <Footer />
    </div>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});