import { cn } from "../utils/cn";

interface BookmarkIconButtonProps {
  isBookmarked: boolean;
  disabled?: boolean;
  onClick: () => void;
}

// 모양만 담당해요. 즐겨찾기 여부와 클릭 동작은 바깥에서 정해서 넘겨 줘요.
export function BookmarkIconButton({
  isBookmarked,
  disabled = false,
  onClick,
}: BookmarkIconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white disabled:opacity-60",
        isBookmarked ? "bg-[#2563eb]" : "bg-[#17191e]",
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      disabled={disabled}
      onClick={onClick}
    >
      <img
        className="h-6 w-6 brightness-0 invert"
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
    </button>
  );
}
