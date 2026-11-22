import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Rating } from "../../api/ratings/types";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "../../hooks/use-rating-mutations";
import { cn } from "../../utils/cn";

interface RatingPanelProps {
  movieId: number;
  myRating: Rating | undefined; // 이 영화에 남긴 내 평점 (없으면 undefined)
  isLoggedIn: boolean;
}

export function RatingPanel({
  movieId,
  myRating,
  isLoggedIn,
}: RatingPanelProps) {
  const router = useRouter();
  const [score, setScore] = useState(myRating?.score ?? 0);
  const [review, setReview] = useState(myRating?.comment ?? "");

  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const comment = review.trim() === "" ? null : review.trim();

  const handleSave = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (score === 0 || isPending) return;

    if (myRating) {
      updateMutation.mutate({ ratingId: myRating.ratingId, score, comment });
    } else {
      createMutation.mutate({ movieId, score, comment });
    }
  };

  const handleDelete = () => {
    if (!myRating || isPending) return;
    if (!confirm("평점을 삭제할까요?")) return;
    deleteMutation.mutate(myRating.ratingId);
  };

  return (
    <aside className="w-[376px] shrink-0 border-l border-gray-200 pl-8">
      <h2 className="text-xl font-bold">내 평점</h2>
      <p className="mt-1 text-xs text-gray-400">
        {myRating
          ? "이미 남긴 평점이 있어요. 수정하거나 삭제할 수 있어요."
          : "별점은 필수, 후기는 선택이에요."}
      </p>

      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setScore(value)}
            aria-label={`${value}점`}
            className={cn(
              "flex size-10 items-center justify-center rounded-md border bg-white",
              value <= score ? "border-gray-900" : "border-gray-200",
            )}
          >
            <img
              src={
                value <= score ? "/icons/star.svg" : "/icons/star-outline.svg"
              }
              alt=""
              className="size-5"
            />
          </button>
        ))}
      </div>

      <textarea
        name="review"
        value={review}
        maxLength={500}
        onChange={(event) => setReview(event.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-3 h-[105px] w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none placeholder:text-gray-400 focus:border-gray-900"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={score === 0 || isPending}
        className="mt-2 h-[42px] w-full rounded-md bg-gray-900 text-sm font-bold text-white disabled:opacity-40"
      >
        {isPending ? "처리 중" : myRating ? "평점 수정" : "평점 저장"}
      </button>

      {myRating && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="mt-2 h-[42px] w-full rounded-md border border-red-400 bg-white text-sm font-bold text-red-500 disabled:opacity-40"
        >
          평점 삭제
        </button>
      )}
    </aside>
  );
}
