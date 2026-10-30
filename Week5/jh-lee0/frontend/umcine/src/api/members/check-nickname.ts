// check-nickname.ts
import { backendClient } from "../backend-client";
import type { CheckResponse } from "./models";

function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}

export { checkNickname };