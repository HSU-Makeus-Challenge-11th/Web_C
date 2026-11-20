import { queryOptions } from "@tanstack/react-query";
import { getFavorites, getFavoriteStatus } from "./favorites";

// 즐겨찾기 query의 key를 한곳에 모아요. 모두 "favorites"로 시작해서 로그아웃할 때 한 번에 지울 수 있어요.
const favoriteQueries = {
  all: () => ["favorites"] as const,
  // 마이페이지 목록과 영화 카드의 즐겨찾기 표시가 함께 써요. (카드마다 요청하지 않고 목록 한 번으로 확인)
  list: () =>
    queryOptions({
      queryKey: [...favoriteQueries.all(), "list"],
      queryFn: getFavorites,
    }),
  // 영화 상세 화면에서 이 영화 하나의 즐겨찾기 여부를 물어요.
  status: (movieId: number) =>
    queryOptions({
      queryKey: [...favoriteQueries.all(), "status", movieId],
      queryFn: () => getFavoriteStatus(movieId),
    }),
};

export { favoriteQueries };
