import { Outlet, useLocation } from "@tanstack/react-router";
import { Header } from "./header";
import { tmdbConfigError } from "../config/env";

export function RootLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {tmdbConfigError && pathname !== '/members' ? (
        <main className="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-20">
          <h1 className="text-2xl font-bold">TMDB 설정이 필요해요.</h1>
          <p role="alert" className="mt-4 text-gray-600">{tmdbConfigError}</p>
        </main>
      ) : <Outlet />}

      <footer className="flex min-h-[62px] shrink-0 flex-col items-center justify-center gap-2.5 border-t border-[#eceef1] bg-white px-6 py-4 text-center text-[10px] text-gray-400 sm:flex-row">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-auto w-[52px]"
        />
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </footer>
    </div>
  );
}
