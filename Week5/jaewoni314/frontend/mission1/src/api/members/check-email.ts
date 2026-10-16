import { umcClient } from "../umc-client";
import type { CheckResponse } from "./models";

function checkEmail(email: string) {
  return umcClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}

export { checkEmail };
