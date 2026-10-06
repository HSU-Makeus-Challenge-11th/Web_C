export function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 border-t border-line p-6 text-xs text-muted sm:flex-row sm:items-center">
      <img className="w-[120px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </footer>
  );
}
