import { umcClient } from "../umc-client";
import type { AvailabilityResponse } from "./models";

export function checkEmail(email: string) {
  return umcClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();
}
