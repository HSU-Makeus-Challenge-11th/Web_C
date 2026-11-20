import Image from "next/image";

// 상태도 이벤트도 없는 정적인 화면이라 Server Component로 둬요. 이 컴포넌트의 JS는 브라우저로 보내지지 않아요.
export function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 border-t border-line p-6 text-xs text-muted sm:flex-row sm:items-center">
      {/* SVG는 크기를 줄이거나 형식을 바꿀 필요가 없어서 최적화(unoptimized)하지 않아요. 비율(273.42:35.52)에 맞춰 자리를 잡아 둬요. */}
      <Image src="/images/logos/tmdb-logo.svg" alt="TMDB" width={120} height={16} unoptimized />
      <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </footer>
  );
}
