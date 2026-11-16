import { mutationOptions } from "@tanstack/react-query";
import { login } from "./login";

// queryOptions처럼 mutation의 key와 요청 함수를 한곳에 모아요.
// 화면별 처리(알림, 이동, 캐시 갱신)는 이 옵션을 펼쳐 쓰는 훅(useLoginMutation)에서 더해요.
const authMutations = {
  all: () => ["auth"] as const,
  login: () =>
    mutationOptions({
      mutationKey: [...authMutations.all(), "login"],
      mutationFn: login,
    }),
};

export { authMutations };
