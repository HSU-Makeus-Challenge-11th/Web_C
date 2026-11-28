import { useQuery } from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { useMemberId } from "./use-member-id";

// 영화 상세 화면에서 이 영화가 내 즐겨찾기인지 물어요.
export function useFavoriteStatusQuery(movieId: number) {
  const memberId = useMemberId();

  return useQuery({
    queryKey: ["favorites", memberId, "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: memberId !== undefined,
    retry: false,
  });
}
