// src/guard/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express';
import { ApiException } from '../exception/api.exception.js';

const BEARER_PREFIX = 'Bearer ';

// Express Request에 memberId 속성을 추가한 인터페이스 정의
export interface AuthenticatedRequest extends Request {
  memberId?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 컨트롤러가 실행되기 "전"에 호출됩니다.
   * true를 반환하면 요청이 컨트롤러까지 이어지고 예외를 던지면 여기서 끝납니다.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // AuthenticatedRequest 타입으로 확장하여 가져옵니다.
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    // "Bearer {토큰}" 형식이 아니면 아예 토큰을 보내지 않은 것으로 봅니다
    if (!header || !header.startsWith(BEARER_PREFIX)) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_2',
        '로그인이 필요한 요청입니다.',
      );
    }

    const token = header.slice(BEARER_PREFIX.length);

    try {
      // 서명과 만료 시각을 함께 검증합니다. 실패하면 예외가 납니다.
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token);

      // 뒤이어 실행될 컨트롤러가 꺼내 쓸 수 있도록 요청 객체에 담아둡니다.
      // 점 표기법(request.memberId)으로 안전하게 설정합니다.
      request.memberId = Number(payload.sub);
    } catch (error) {
      // 만료는 사용자가 다시 로그인하면 해결되는 상황이라 따로 구분해줍니다
      if (error instanceof TokenExpiredError) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          'AUTH401_4',
          '토큰이 만료되었습니다. 다시 로그인해주세요.',
        );
      }
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_3',
        '유효하지 않은 토큰입니다.',
      );
    }

    return true;
  }
}
