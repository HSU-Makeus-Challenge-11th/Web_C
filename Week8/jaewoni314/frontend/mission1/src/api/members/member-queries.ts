import { queryOptions } from "@tanstack/react-query";
import { getMe } from "./me";

const FIVE_MINUTES = 5 * 60 * 1000;

// 회원 query의 key를 한곳에 모아요. 로그인, 내 정보 수정이 같은 key(["members", "me"])를 갱신해요.
const memberQueries = {
  all: () => ["members"] as const,
  me: () =>
    queryOptions({
      queryKey: [...memberQueries.all(), "me"],
      queryFn: getMe,
      // 내 정보는 내가 바꾸지 않는 한 잘 바뀌지 않아서 5분 동안 다시 요청하지 않아요.
      staleTime: FIVE_MINUTES,
      // 401로 토큰을 비운 뒤 같은 요청을 다시 보내지 않도록 재시도를 꺼요.
      retry: false,
    }),
};

export { memberQueries };
