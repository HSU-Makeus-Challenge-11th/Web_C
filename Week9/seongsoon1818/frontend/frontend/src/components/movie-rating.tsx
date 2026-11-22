"use client";

import { useState, type SubmitEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { getMe } from "../api/members/me";
import { getMemberRatings, type Rating } from "../api/members";
import { deleteRatingMutationOptions, saveRatingMutationOptions } from "../queries/mutation-options";
import { useAuthStore } from "../stores/auth-store";
import { RequestError } from "./request-error";

async function findMyRating(memberId: number, movieId: number, signal: AbortSignal): Promise<Rating | null> {
  let page = 0;
  while (true) {
    const result = await getMemberRatings(memberId, page, 100, signal);
    const rating = result.items.find((item) => item.movieId === movieId);
    if (rating || !result.hasNext) return rating ?? null;
    page += 1;
  }
}

export function MovieRating({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(token),
  });
  const ratingQuery = useQuery({
    queryKey: ["ratings", meQuery.data?.memberId, movieId],
    queryFn: ({ signal }) => findMyRating(meQuery.data!.memberId, movieId, signal),
    enabled: Boolean(meQuery.data?.memberId),
    retry: false,
  });
  const rating = ratingQuery.data;
  const [draft, setDraft] = useState({ score: 5, comment: "" });
  const [editing, setEditing] = useState(false);
  const saveMutation = useMutation({
    ...saveRatingMutationOptions(movieId, rating?.ratingId),
    onSuccess: () => {
      setEditing(false);
      void queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
  });
  const deleteMutation = useMutation({
    ...deleteRatingMutationOptions(movieId, rating?.ratingId),
    onSuccess: () => {
      setEditing(false);
      void queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
  });

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!saveMutation.isPending && !deleteMutation.isPending && draft.comment.length <= 500) {
      saveMutation.mutate({ score: draft.score, comment: draft.comment.trim() || null });
    }
  }

  return (
    <section className="mx-auto w-[calc(100%-32px)] max-w-[1280px] pb-12 sm:w-[calc(100%-48px)]">
      <h2 className="text-2xl font-bold">내 평점</h2>
      {!token && <Link href="/login" className="mt-4 inline-block font-semibold text-brand">로그인 후 평점을 남길 수 있어요.</Link>}
      {token && meQuery.isError && <RequestError message="회원 정보를 불러오지 못했어요." onRetry={() => void meQuery.refetch()} />}
      {token && (meQuery.isPending || (meQuery.isSuccess && ratingQuery.isPending)) && <p role="status" className="mt-4">평점을 불러오는 중이에요.</p>}
      {token && meQuery.isSuccess && ratingQuery.isError && <RequestError message="평점을 불러오지 못했어요." onRetry={() => void ratingQuery.refetch()} />}
      {token && meQuery.isSuccess && ratingQuery.isSuccess && rating && !editing && (
        <div className="mt-4 space-y-3">
          <p className="font-semibold">{rating.score} / 5점</p>
          <p className="whitespace-pre-wrap">{rating.comment || "작성한 후기가 없어요."}</p>
          <button type="button" className="mr-4 font-semibold text-brand" onClick={() => { setDraft({ score: rating.score, comment: rating.comment ?? "" }); setEditing(true); }}>수정</button>
          <button type="button" className="font-semibold text-red-700 disabled:opacity-50" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>{deleteMutation.isPending ? "삭제 중" : "삭제"}</button>
        </div>
      )}
      {token && meQuery.isSuccess && ratingQuery.isSuccess && (!rating || editing) && (
        <form onSubmit={submit} className="mt-4 max-w-lg space-y-3">
          <label className="block font-semibold">평점
            <select className="account-input mt-2" value={draft.score} disabled={saveMutation.isPending} onChange={(event) => setDraft({ ...draft, score: Number(event.target.value) })}>
              {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}점</option>)}
            </select>
          </label>
          <label className="block font-semibold">후기
            <textarea className="account-input mt-2 min-h-28" maxLength={500} value={draft.comment} disabled={saveMutation.isPending} onChange={(event) => setDraft({ ...draft, comment: event.target.value })} />
          </label>
          <button type="submit" className="account-primary" disabled={saveMutation.isPending}>{saveMutation.isPending ? "저장 중" : "평점 저장"}</button>
          {editing && <button type="button" className="ml-3 font-semibold" onClick={() => setEditing(false)}>취소</button>}
        </form>
      )}
      {(saveMutation.isError || deleteMutation.isError) && <p role="alert" className="mt-3 text-red-700">평점을 변경하지 못했어요. 다시 시도해 주세요.</p>}
    </section>
  );
}
