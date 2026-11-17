import { apiClient } from "../api-client";
import type { Rating } from "./types";

export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}
