import { apiClient } from "../api-client";

export interface RatingItem {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt?: string;
}

interface GetMemberRatingsResponse {
  isSuccess?: boolean;
  result?: RatingItem[];
}

export async function getMemberRatings(
  memberId: number,
): Promise<RatingItem[]> {
  const response = await apiClient
    .get(`members/${memberId}/ratings`)
    .json<GetMemberRatingsResponse | RatingItem[]>();

  if (Array.isArray(response)) return response;
  return response.result ?? [];
}
