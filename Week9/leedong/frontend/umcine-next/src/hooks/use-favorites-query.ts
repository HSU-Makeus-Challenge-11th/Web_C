import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";
import { useMemberId } from "./use-member-id";

// 내 즐겨찾기 목록. 마이페이지와 목록 화면의 북마크 버튼이 같은 캐시를 공유해요.
// 계정이 바뀌어도 이전 사람의 목록이 보이지 않도록 memberId를 key에 넣어요.
export function useFavoritesQuery() {
  const memberId = useMemberId();

  return useQuery({
    queryKey: ["favorites", memberId, "list"],
    queryFn: getFavorites,
    enabled: memberId !== undefined,
    retry: false,
  });
}
