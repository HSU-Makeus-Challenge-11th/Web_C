import { umcClient } from "../umc-client";
import type { RatingResponse } from "./models";

function getMemberRatings(memberId: number) {
  return umcClient.get(`members/${memberId}/ratings`).json<RatingResponse[]>();
}

export { getMemberRatings };
