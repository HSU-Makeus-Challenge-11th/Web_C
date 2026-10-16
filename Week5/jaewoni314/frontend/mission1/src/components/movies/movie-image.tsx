import { cn } from "../../utils/cn";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

// URL이 없으면 <img>에 null을 넣지 않고 같은 크기의 회색 영역을 보여 줘요.
export function MovieImage({ src, alt, className, loading = "lazy" }: MovieImageProps) {
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

  return <img className={cn("object-cover", className)} src={src} alt={alt} loading={loading} />;
}
