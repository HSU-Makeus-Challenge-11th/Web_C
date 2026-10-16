import { umcClient } from "../umc-client";
import type { CheckResponse } from "./models";

function checkNickname(nickname: string) {
  // 한글이나 특수문자도 안전하게 path에 넣도록 인코딩해요.
  return umcClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}

export { checkNickname };
