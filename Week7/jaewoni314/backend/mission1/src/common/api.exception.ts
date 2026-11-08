import { HttpException } from "@nestjs/common";
import type { ErrorCode } from "./error-code.js";

// 서비스에서 정해 둔 ErrorCode로 던지면, 전역 필터가 그 code와 message 그대로 응답해요.
export class ApiException extends HttpException {
  constructor(readonly error: ErrorCode) {
    super(error.message, error.status);
  }
}
