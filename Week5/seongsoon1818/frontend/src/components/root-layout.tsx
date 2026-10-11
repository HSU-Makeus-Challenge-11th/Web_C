import { Outlet } from "@tanstack/react-router";
import { Header } from "./header";

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <Outlet />

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