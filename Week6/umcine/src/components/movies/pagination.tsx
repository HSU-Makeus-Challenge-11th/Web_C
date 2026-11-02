export default function Pagination() {
  return (
    <footer className="mt-[130px] w-full bg-white border-t border-[#e5e7eb] px-[120px] py-[24px] flex justify-end items-center gap-[8px] box-border">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB 로고"
        className="h-[12px] w-auto object-contain"
      />
      <p className="text-[15px] text-[#333] m-0">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <span className="underline">TMDB.</span>
      </p>
    </footer>
  );
}
