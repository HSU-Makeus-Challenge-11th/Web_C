// get-member-ratings.ts
import { backendClient } from "../backend-client";
import type { Rating } from "./models";

function getMemberRatings(memberId: number) {
  return backendClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export { getMemberRatings };