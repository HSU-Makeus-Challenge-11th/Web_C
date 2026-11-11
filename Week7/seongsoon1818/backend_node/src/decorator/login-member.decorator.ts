import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const LoginMember = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.memberId as number;
  },
);
