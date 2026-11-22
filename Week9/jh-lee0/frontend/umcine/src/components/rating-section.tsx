"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import type { Rating } from "@/api/ratings/ratings";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMyRatingsQuery,
  useUpdateRatingMutation,
} from "@/hooks/use-rating";

// 미션 8: 영화 상세 오른쪽 "내 평점" 영역 (별 5칸 + 후기 입력칸 + 평점 저장 버튼)

interface RatingSectionProps {
  movieId: number;
}

export function RatingSection({ movieId }: RatingSectionProps) {
  const accessToken = useAuthStore((state) => state.accessToken); // 로그인 여부
  const myRatingsQuery = useMyRatingsQuery(); // 내 평점 전부 (미션 7 훅)

  // 내 평점 전부 중에서 "이 영화" 것만 찾기 (없으면 undefined)
  const myRating = (myRatingsQuery.data ?? []).find(
    (rating) => rating.movieId === movieId,
  );

  return (
    <div>
      <h2 className="text-lg font-bold text-[#111111]">내 평점</h2>
      <p className="mt-1 text-xs text-[#9CA3AF]">별점은 필수, 후기는 선택이에요.</p>

      {!accessToken ? (
        // 로그인 안 함 → 로그인 페이지로 가는 버튼
        <Link
          href="/login"
          className="mt-4 flex h-11 w-full items-center justify-center rounded-md bg-[#111111] text-sm font-bold text-white"
        >
          로그인하고 평점 남기기
        </Link>
      ) : myRatingsQuery.isPending ? (
        <p className="mt-4 text-sm text-[#9CA3AF]">내 평점을 불러오는 중이에요...</p>
      ) : (
        // key: 내 평점이 생기거나(등록) 없어지면(삭제) 폼을 새로 그려서 초깃값을 다시 채움
        <RatingForm
          key={myRating ? myRating.ratingId : "new"}
          movieId={movieId}
          myRating={myRating}
        />
      )}
    </div>
  );
}

// 별 아이콘 (선택된 별은 노란색, 아닌 별은 회색)
function StarIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#FACC15" : "#6B7280"}>
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
    </svg>
  );
}

interface RatingFormProps {
  movieId: number;
  myRating?: Rating; // 이미 남긴 평점 (없으면 undefined)
}

// 별 5칸 + 후기 입력칸 + 평점 저장 버튼
// 평점이 없으면 "등록"(POST), 있으면 기존 값을 채워서 "수정"(PATCH)
function RatingForm({ movieId, myRating }: RatingFormProps) {
  const [score, setScore] = useState(myRating ? myRating.score : 0);
  const [comment, setComment] = useState(myRating?.comment ?? "");

  const createMutation = useCreateRatingMutation(); // POST /ratings
  const updateMutation = useUpdateRatingMutation(); // PATCH /ratings/{ratingId}
  const deleteMutation = useDeleteRatingMutation(); // DELETE /ratings/{ratingId}

  const isSaving = createMutation.isPending || updateMutation.isPending;
  // 별점 1~5를 골랐고, 후기가 500자 이하일 때만 저장 가능 (백엔드 규칙과 같음)
  const canSubmit = score >= 1 && score <= 5 && comment.length <= 500;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // 새로고침 방지
    if (!canSubmit || isSaving) return;

    if (myRating) {
      // 이미 평점이 있으면 수정
      updateMutation.mutate({ ratingId: myRating.ratingId, score, comment: comment.trim() });
    } else {
      // 없으면 등록
      createMutation.mutate({ movieId, score, comment: comment.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 별 5칸: 누른 칸까지 노란 별, 누르면 그 점수로 */}
      <div className="mt-4 flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setScore(value)}
            aria-label={`${value}점`}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E3E5EA] bg-white"
          >
            <StarIcon active={value <= score} />
          </button>
        ))}
      </div>

      {/* 후기 입력칸 */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-4 h-28 w-full resize-none rounded-md border border-[#E3E5EA] bg-white p-3 text-sm outline-none placeholder:text-[#9CA3AF]"
      />

      {/* 평점 저장 버튼 (등록·수정 공통) */}
      <button
        type="submit"
        disabled={!canSubmit || isSaving}
        className="mt-4 h-11 w-full rounded-md bg-[#111111] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "저장 중" : "평점 저장"}
      </button>

      {/* 이미 평점이 있을 때만 보이는 삭제 버튼 */}
      {myRating && (
        <button
          type="button"
          disabled={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate(myRating.ratingId)}
          className="mt-2 w-full text-xs font-bold text-[#DC2626] disabled:opacity-50"
        >
          {deleteMutation.isPending ? "삭제 중" : "평점 삭제"}
        </button>
      )}
    </form>
  );
}
