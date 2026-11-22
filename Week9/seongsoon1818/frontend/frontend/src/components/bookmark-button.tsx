"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { getFavorite } from "../api/favorites";
import { favoriteMutationOptions } from "../queries/mutation-options";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className,
}: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const favoriteQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavorite(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });
  const mutation = useMutation({
    ...favoriteMutationOptions(movieId),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["favorites"] }); },
  });

  if (!accessToken) {
    return <Link href="/login" className={cn("inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold", className)}>로그인 후 즐겨찾기</Link>;
  }

  const isFavorite = favoriteQuery.data ?? false;

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={`${movieTitle} ${isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}`}
        aria-pressed={isFavorite}
        disabled={favoriteQuery.isPending || favoriteQuery.isError || mutation.isPending}
        onClick={() => mutation.mutate(isFavorite)}
        className={cn(
          "rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-50",
          isFavorite ? "border-brand bg-brand text-white" : "border-gray-300 bg-white text-gray-700",
        )}
      >
        {mutation.isPending ? "처리 중" : isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      </button>
      {favoriteQuery.isError && <button type="button" className="ml-2 text-sm text-red-700" onClick={() => void favoriteQuery.refetch()}>다시 시도</button>}
      {mutation.isError && <p role="alert" className="mt-1 text-sm text-red-700">즐겨찾기를 변경하지 못했어요.</p>}
    </div>
  );
}
