import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";
import { useDeleteRatingMutation } from "../../hooks/use-delete-rating-mutation";
import { useMemberId } from "../../hooks/use-member-id";
import { useRatingsQuery } from "../../hooks/use-ratings-query";
import { useUpdateRatingMutation } from "../../hooks/use-update-rating-mutation";
import { cn } from "../../utils/cn";

const SCORES = [1, 2, 3, 4, 5];
const COMMENT_MAX_LENGTH = 500;

interface RatingSectionProps {
  movieId: number;
}

export function RatingSection({ movieId }: RatingSectionProps) {
  const memberId = useMemberId();
  const ratingsQuery = useRatingsQuery(memberId);
  const createRatingMutation = useCreateRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();

  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const myRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);
  const isSaving =
    createRatingMutation.isPending || updateRatingMutation.isPending;

  if (memberId === undefined) {
    return (
      <section className="my-4">
        <h2 className="font-extrabold">내 평점</h2>
        <p>
          로그인하면 평점을 남길 수 있어요. <Link href="/login">로그인</Link>
        </p>
      </section>
    );
  }

  if (ratingsQuery.isPending) {
    return (
      <section className="my-4">
        <h2 className="font-extrabold">내 평점</h2>
        <p>평점을 불러오는 중이에요.</p>
      </section>
    );
  }

  if (ratingsQuery.isError) {
    return (
      <section className="my-4">
        <h2 className="font-extrabold">내 평점</h2>
        <p>평점을 불러오지 못했어요.</p>
      </section>
    );
  }

  function startEditing() {
    if (!myRating) return;

    setScore(myRating.score);
    setComment(myRating.comment ?? "");
    setIsEditing(true);
  }

  function handleDelete() {
    if (!myRating) return;
    if (!window.confirm("평점을 삭제할까요?")) return;

    deleteRatingMutation.mutate(myRating.ratingId);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedComment = comment.trim();

    if (myRating) {
      updateRatingMutation.mutate(
        { ratingId: myRating.ratingId, score, comment: trimmedComment },
        { onSuccess: () => setIsEditing(false) },
      );
      return;
    }

    createRatingMutation.mutate(
      { movieId, score, comment: trimmedComment || undefined },
      { onSuccess: () => setComment("") },
    );
  }

  if (myRating && !isEditing) {
    return (
      <section className="my-4">
        <h2 className="font-extrabold">내 평점</h2>
        <p>{myRating.score}점</p>
        <p>{myRating.comment ? myRating.comment : "후기를 남기지 않았어요."}</p>
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={startEditing}>
            수정
          </button>
          <button
            type="button"
            disabled={deleteRatingMutation.isPending}
            onClick={handleDelete}
          >
            {deleteRatingMutation.isPending ? "삭제 중" : "삭제"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="my-4">
      <h2 className="font-extrabold">{myRating ? "평점 수정" : "평점 남기기"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-1" role="radiogroup" aria-label="별점">
          {SCORES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={score === value}
              className={cn(
                "h-9 w-9 rounded-md border text-sm font-bold",
                score === value ? "bg-[#17191e] text-white" : "bg-white",
              )}
              onClick={() => setScore(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <textarea
          className="rounded-md border p-2"
          rows={3}
          maxLength={COMMENT_MAX_LENGTH}
          placeholder="후기를 남겨 보세요 (선택, 500자 이하)"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <div className="flex gap-2">
          <button type="submit" disabled={isSaving}>
            {isSaving ? "저장 중" : myRating ? "수정 완료" : "등록"}
          </button>
          {myRating && (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
