import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import type { Request } from "express";
import { ApiException } from "../common/api.exception.js";
import { ErrorCodes } from "../common/error-code.js";

const BEARER_PREFIX = "Bearer ";

interface AccessTokenPayload {
  sub: string;
  email: string;
}

// express의 Request에는 memberId가 없어서, Guard가 담아 둘 자리를 타입에 더했어요.
export interface AuthenticatedRequest extends Request {
  memberId: number;
}

// 컨트롤러에 도달하기 전에 Authorization 헤더의 토큰을 검사하는 관문이에요.
// @UseGuards(AuthGuard)를 붙인 메서드에만 적용되니, 로그인이 필요한 API에는 꼭 붙여야 해요.
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // true를 돌려주면 요청이 컨트롤러로 이어지고, 예외를 던지면 여기서 끝나요.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    // "Bearer {토큰}" 형식이 아니면 토큰을 보내지 않은 것으로 봐요.
    if (!header || !header.startsWith(BEARER_PREFIX)) {
      throw new ApiException(ErrorCodes.AUTH_TOKEN_MISSING);
    }

    const token = header.slice(BEARER_PREFIX.length);
    let payload: AccessTokenPayload;
    try {
      // 서명과 만료 시각을 함께 검증해요. 하나라도 맞지 않으면 예외가 나요.
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch (error) {
      // 만료는 다시 로그인하면 해결되는 상황이라 따로 구분해요.
      if (error instanceof TokenExpiredError) {
        throw new ApiException(ErrorCodes.AUTH_TOKEN_EXPIRED);
      }
      throw new ApiException(ErrorCodes.AUTH_TOKEN_INVALID);
    }

    // sub는 문자열로 저장되므로 숫자로 바꿔요. 회원 ID가 될 수 없는 값이면 잘못된 토큰으로 봐요.
    const memberId = Number(payload.sub);
    if (!Number.isSafeInteger(memberId) || memberId < 1) {
      throw new ApiException(ErrorCodes.AUTH_TOKEN_INVALID);
    }

    // 뒤이어 실행될 컨트롤러가 꺼내 쓸 수 있도록 요청 객체에 담아 둬요.
    request.memberId = memberId;
    return true;
  }
}
