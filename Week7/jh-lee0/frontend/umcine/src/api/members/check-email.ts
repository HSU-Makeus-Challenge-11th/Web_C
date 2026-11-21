import { backendClient } from "../backend-client";
import type { CheckResponse } from "./models";

function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}

export { checkEmail };
