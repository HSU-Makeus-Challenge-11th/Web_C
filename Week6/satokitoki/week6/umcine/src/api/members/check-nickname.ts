import { umcClient } from "../umc-client";
import type { AvailabilityResponse } from "./models";

export function checkNickname(nickname: string) {
  return umcClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}
