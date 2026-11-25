import { queryOptions } from "@tanstack/react-query";
import { getMemberRatings } from "../members/get-member-ratings";

const ratingQueries = {
  all: () => ["ratings"] as const,
  // GET /members/{memberId}/ratings: 회원이 남긴 평점 목록 (최신순)
  // 영화 상세의 "내 평점"과 마이페이지의 "내가 남긴 평점"이 같은 캐시를 써요.
  byMember: (memberId: number) =>
    queryOptions({
      queryKey: [...ratingQueries.all(), "member", memberId],
      queryFn: () => getMemberRatings(memberId),
    }),
};

export { ratingQueries };
