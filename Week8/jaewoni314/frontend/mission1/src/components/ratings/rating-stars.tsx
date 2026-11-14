import { cn } from "../../utils/cn";

const SCORES = [1, 2, 3, 4, 5];

// 읽기 전용 별점 (예: ★★★★☆)
export function RatingStars({ score, className }: { score: number; className?: string }) {
  return (
    <span className={cn("tracking-[0.1em] text-accent", className)} role="img" aria-label={`별점 ${score}점`}>
      {"★".repeat(score)}
      <span className="text-line">{"★".repeat(5 - score)}</span>
    </span>
  );
}

// 1~5점을 고르는 별점 입력. 라디오 버튼이라 키보드 방향키로도 고를 수 있어요.
export function RatingStarInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (score: number) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="flex items-center gap-1" disabled={disabled}>
      <legend className="sr-only">별점</legend>
      {SCORES.map((score) => (
        <label key={score} className="cursor-pointer text-[28px] leading-none">
          <input
            type="radio"
            name="score"
            className="peer sr-only"
            value={score}
            checked={value === score}
            onChange={() => onChange(score)}
          />
          <span
            className={cn(
              "rounded peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent",
              score <= value ? "text-accent" : "text-line hover:text-muted",
            )}
            aria-hidden="true"
          >
            ★
          </span>
          <span className="sr-only">{score}점</span>
        </label>
      ))}
      <span className="ml-2 text-sm text-muted">{value > 0 ? `${value}점` : "별점을 골라 주세요"}</span>
    </fieldset>
  );
}
