import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { tmdbConfigError } from "./config/env";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  if (tmdbConfigError) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-2xl font-bold">TMDB 설정이 필요해요.</h1>
        <p role="alert" className="mt-4 text-gray-600">{tmdbConfigError}</p>
        <p className="mt-4 leading-7 text-gray-600">
          frontend 폴더의 .env.example을 .env.local로 복사하고,
          VITE_TMDB_ACCESS_TOKEN에 TMDB의 API Read Access Token을 입력한 뒤
          개발 서버를 다시 시작해 주세요.
        </p>
      </main>
    );
  }

  return <RouterProvider router={router} />;
}
