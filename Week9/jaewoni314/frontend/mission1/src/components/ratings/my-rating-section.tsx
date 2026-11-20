import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import type { RatingResponse } from "../../api/members/models";
import { ratingQueries } from "../../api/ratings/rating-queries";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMyMemberId,
  useUpdateRatingMutation,
} from "../../hooks/ratings/use-rating-mutations";
import { cn } from "../../utils/cn";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { primaryButtonClass, secondaryButtonClass } from "../form/button-styles";
import { RatingStarInput, RatingStars } from "./rating-stars";

const COMMENT_MAX_LENGTH = 500;
const sectionClass = "mt-10 max-w-[760px] rounded-xl border border-line p-6";

// 영화 상세의 "내 평점": 없으면 등록, 있으면 보기/수정/삭제
export function MyRatingSection({ movieId }: { movieId: number }) {
  const memberId = useMyMemberId();
  const [isEditing, setIsEditing] = useState(false);

  // 영화 하나의 평점을 묻는 API는 없어서, 내 평점 목록(GET /members/{memberId}/ratings)에서 이 영화를 찾아요.
  const myRatingQuery = useQuery({
    ...ratingQueries.byMember(memberId ?? 0),
    select: (ratings) => ratings.find((rating) => rating.movieId === movieId) ?? null,
    enabled: memberId !== null,
  });
  const deleteMutation = useDeleteRatingMutation();

  if (memberId === null) {
    return (
      <section className={sectionClass} aria-labelledby="my-rating-title">
        <h2 id="my-rating-title" className="text-lg font-bold">
          내 평점
        </h2>
        <p className="mt-2 text-[15px] text-muted">
          <Link to="/login" className="font-semibold text-accent hover:underline">
            로그인
          </Link>
          하고 이 영화에 평점을 남겨 보세요.
        </p>
      </section>
    );
  }

  const myRating = myRatingQuery.data;

  const handleDelete = (rating: RatingResponse) => {
    if (!confirm("이 영화에 남긴 평점을 삭제할까요?")) return;
    deleteMutation.mutate(rating.ratingId, {
      onSuccess: () => alert("평점을 삭제했어요."),
    });
  };

  return (
    <section className={sectionClass} aria-labelledby="my-rating-title">
      <h2 id="my-rating-title" className="text-lg font-bold">
        내 평점
      </h2>

      {myRatingQuery.isPending && <p className="mt-3 text-sm text-muted">내 평점을 불러오는 중이에요.</p>}
      {myRatingQuery.isError && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {getApiErrorMessage(myRatingQuery.error, "내 평점을 불러오지 못했어요.")}
        </p>
      )}

      {myRatingQuery.isSuccess && !myRating && <RatingForm movieId={movieId} />}

      {myRating && isEditing && (
        <RatingForm movieId={movieId} rating={myRating} onDone={() => setIsEditing(false)} />
      )}

      {myRating && !isEditing && (
        <div className="mt-4">
          <RatingStars score={myRating.score} className="text-2xl" />
          <p className="mt-2 whitespace-pre-wrap break-all text-[15px] leading-[1.7]">
            {myRating.comment ?? <span className="text-muted">남긴 후기가 없어요.</span>}
          </p>
          <p className="mt-2 text-xs text-muted">
            {new Date(myRating.updatedAt).toLocaleString("ko-KR")}
            {myRating.updatedAt !== myRating.createdAt && " (수정됨)"}
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" className={secondaryButtonClass} onClick={() => setIsEditing(true)}>
              수정
            </button>
            <button
              type="button"
              className={cn(secondaryButtonClass, "text-red-400")}
              disabled={deleteMutation.isPending}
              onClick={() => handleDelete(myRating)}
            >
              {deleteMutation.isPending ? "삭제 중" : "삭제"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// rating이 있으면 수정(PATCH), 없으면 등록(POST) 폼이에요.
function RatingForm({
  movieId,
  rating,
  onDone,
}: {
  movieId: number;
  rating?: RatingResponse;
  onDone?: () => void;
}) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const trimmedComment = comment.trim();
  const canSubmit = score >= 1 && score <= 5 && trimmedComment.length <= COMMENT_MAX_LENGTH;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isPending) return;

    // 후기를 비우면 보내지 않아요. 수정에서 빼고 보내면 서버가 기존 후기를 지워요(null).
    const body = { score, comment: trimmedComment || undefined };

    if (rating) {
      updateMutation.mutate(
        { ratingId: rating.ratingId, ...body },
        {
          onSuccess: () => {
            alert("평점을 수정했어요.");
            onDone?.();
          },
        },
      );
    } else {
      createMutation.mutate({ movieId, ...body }, { onSuccess: () => alert("평점을 등록했어요.") });
    }
  };

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
      <RatingStarInput value={score} onChange={setScore} disabled={isPending} />
      <label className="flex flex-col gap-1.5">
        <span className="sr-only">후기</span>
        <textarea
          className="min-h-24 w-full resize-y rounded-lg border border-line bg-surface px-4 py-3 text-[15px] placeholder:text-muted disabled:opacity-60"
          placeholder="이 영화는 어땠나요? (선택)"
          maxLength={COMMENT_MAX_LENGTH}
          value={comment}
          disabled={isPending}
          onChange={(event) => setComment(event.target.value)}
        />
        <span className="self-end text-xs text-muted">
          {comment.length} / {COMMENT_MAX_LENGTH}
        </span>
      </label>
      <div className="flex gap-2">
        {rating && (
          <button type="button" className={secondaryButtonClass} disabled={isPending} onClick={onDone}>
            취소
          </button>
        )}
        <button type="submit" className={cn(primaryButtonClass, "flex-1")} disabled={!canSubmit || isPending}>
          {isPending ? "저장 중" : rating ? "수정하기" : "평점 남기기"}
        </button>
      </div>
    </form>
  );
}
