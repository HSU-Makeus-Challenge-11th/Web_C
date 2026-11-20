import Image from "next/image";
import { cn } from "../../utils/cn";

interface MovieImageProps {
  src: string | null;
  alt: string;
  // 이미지가 화면에서 차지할 너비예요. 브라우저가 이 값을 보고 srcset 중 알맞은 크기의 파일을 골라요.
  sizes: string;
  className?: string;
  // 첫 화면에 바로 보이는 큰 이미지(상세의 배경, 포스터)는 미리 불러와요. Next.js 16부터 priority 대신 preload를 써요.
  preload?: boolean;
}

// 8주차에는 <img>로 TMDB 원본(w500, w1280 JPG)을 그대로 받았어요.
// next/image는 /_next/image를 거쳐 필요한 크기와 브라우저가 지원하는 형식(WebP 등)으로 줄여 주고, 기본으로 지연 로딩해요.
// 카드마다 크기가 className(h-, w-, aspect-)으로 정해져 있어서, 그 영역을 채우는 fill 방식으로 표시해요.
// 영역 크기를 미리 잡아 두므로 이미지가 늦게 와도 주변 내용이 밀리지(layout shift) 않아요.
export function MovieImage({ src, alt, sizes, className, preload = false }: MovieImageProps) {
  if (!src) {
    return (
      <div
        className={cn("grid place-items-center bg-surface text-sm text-muted", className)}
        role="img"
        aria-label={alt}
      >
        이미지 없음
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image className="object-cover" src={src} alt={alt} fill sizes={sizes} preload={preload} />
    </div>
  );
}
