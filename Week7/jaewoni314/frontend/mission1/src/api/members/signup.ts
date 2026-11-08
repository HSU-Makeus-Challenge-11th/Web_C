import { umcClient } from "../umc-client";
import type { SignupRequest, SignupResponse } from "./models";

// passwordConfirm은 화면에서만 검사하므로 요청에 넣지 않아요.
function signup(body: SignupRequest) {
  return umcClient.post("members", { json: body }).json<SignupResponse>();
}

export { signup };
