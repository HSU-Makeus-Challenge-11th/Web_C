"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import {
  useFavoriteStatusQuery,
  useToggleFavoriteMutation,
} from "@/hooks/use-favorite";

// 미션 5: 서버 즐겨찾기와 연결된 버튼 (기존 BookmarkButton 대체)
// 미션 8: 피그마 영화 상세 시안에 맞게 모양 변경 (파란 버튼 + 북마크 아이콘 + "즐겨찾기")

interface FavoriteButtonProps {
  movieId: number;
}

// 피그마 시안의 파란 버튼 모양 (로그인 링크와 버튼이 같이 씀)
const BUTTON_CLASS =
  "inline-flex h-10 items-center gap-2 rounded-md bg-[#4A65E5] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50";

// 북마크 아이콘 (즐겨찾기 했으면 꽉 찬 모양, 안 했으면 테두리만)
function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function FavoriteButton({ movieId }: FavoriteButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken); // 로그인 여부
  const statusQuery = useFavoriteStatusQuery(movieId); // 이 영화 즐겨찾기 했나? (미션 4 훅)
  const toggleMutation = useToggleFavoriteMutation(movieId); // 추가/해제 (미션 4 훅)

  // 1) 로그인 안 함 → 같은 모양의 버튼을 누르면 로그인 페이지로
  if (!accessToken) {
    return (
      <Link href="/login" className={BUTTON_CLASS}>
        <BookmarkIcon filled={false} />
        즐겨찾기
      </Link>
    );
  }

  const isFavorite = statusQuery.data === true; // 서버가 알려준 즐겨찾기 여부

  // 2) 누르면 지금 상태의 반대로 (했으면 해제, 안 했으면 추가)
  return (
    <button
      type="button"
      disabled={statusQuery.isPending || toggleMutation.isPending} // 여부 확인 중이거나 보내는 중엔 못 누르게
      onClick={() => toggleMutation.mutate(isFavorite)}
      className={BUTTON_CLASS}
    >
      <BookmarkIcon filled={isFavorite} />
      {isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
    </button>
  );
}
