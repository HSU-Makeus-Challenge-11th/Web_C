export function Footer() {
  return (
    <footer className="flex min-h-[57px] w-full shrink-0 items-center justify-end gap-2 border-t border-[#eceef1] bg-white px-4 py-4 text-xs text-gray-400 sm:px-8 lg:h-[57px] lg:px-20 lg:py-0">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB"
        className="h-auto w-6 shrink-0"
      />
      <p>
        This product uses the TMDB API but is not endorsed or certified by
        TMDB.
      </p>
    </footer>
  );
}
