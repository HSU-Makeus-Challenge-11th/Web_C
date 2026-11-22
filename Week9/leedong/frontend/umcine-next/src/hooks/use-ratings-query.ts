import { useQuery } from "@tanstack/react-query";
import { getRatings } from "../api/ratings/get-ratings";

export function useRatingsQuery(memberId: number | undefined) {
  return useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getRatings(memberId!),
    enabled: memberId !== undefined,
  });
}