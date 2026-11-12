import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthenticatedRequest } from "../guard/auth.guard.js";

// AuthGuard가 토큰에서 꺼내 요청 객체에 담아 둔 회원 ID를 컨트롤러 매개변수로 넘겨줘요.
// 이름만 봐도 "로그인한 회원에게서 온 값"이라는 게 드러나고, 컨트롤러는 요청 객체를 몰라도 돼요.
export const LoginMember = createParamDecorator((_data: unknown, context: ExecutionContext): number => {
  // AuthGuard를 거치지 않았으면 memberId가 없을 수 있어서 Partial로 받아요.
  const request = context.switchToHttp().getRequest<Partial<AuthenticatedRequest>>();

  // @UseGuards(AuthGuard)를 빠뜨리면 회원 ID가 비어 있어요.
  // 개발 실수라서 엉뚱한 값으로 진행하지 않고 서버 오류(500)로 바로 드러나게 해요.
  if (request.memberId === undefined) {
    throw new Error("@LoginMember()는 @UseGuards(AuthGuard)가 붙은 API에서만 쓸 수 있어요.");
  }

  return request.memberId;
});
