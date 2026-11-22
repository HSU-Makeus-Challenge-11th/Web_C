// src/exception/api.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  // code는 응답 바디의 code 필드에 실릴 문자열입니다
  constructor(
    status: HttpStatus,
    public readonly code: string,
    message: string,
  ) {
    super(message, status); // HttpException을 상속하므로 상태 코드는 부모가 들고 있습니다
  }
}
