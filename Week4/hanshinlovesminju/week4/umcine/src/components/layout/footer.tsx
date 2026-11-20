export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-end gap-2 px-20 text-[13px] text-gray-500">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-3" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
