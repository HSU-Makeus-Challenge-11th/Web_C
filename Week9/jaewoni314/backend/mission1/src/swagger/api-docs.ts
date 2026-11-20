import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse as SwaggerResponse } from "@nestjs/swagger";
import type { ErrorCode } from "../common/error-code.js";
import { ErrorCodes } from "../common/error-code.js";

// Swagger의 "Authorize" 버튼에 넣은 토큰을 쓰는 보안 스킴 이름이에요. main.ts의 addBearerAuth와 같아야 해요.
export const BEARER_AUTH = "access-token";

// 공통 응답 형식 { isSuccess, code, message, result }를 그대로 보여 주는 성공 응답 예시예요.
export function ApiSuccess(status: HttpStatus, code: string, message: string, result: unknown) {
  return SwaggerResponse({
    status,
    description: message,
    schema: { example: { isSuccess: true, code, message, result } },
  });
}

// 같은 상태 코드의 실패가 여러 개면 Swagger UI에서 예시를 골라 볼 수 있게 묶어요.
export function ApiFail(status: HttpStatus, ...errors: (ErrorCode | { code: string; message: string })[]) {
  return SwaggerResponse({
    status,
    description: errors.map((error) => `\`${error.code}\` ${error.message}`).join(" / "),
    content: {
      "application/json": {
        examples: Object.fromEntries(
          errors.map((error) => [
            error.code,
            { value: { isSuccess: false, code: error.code, message: error.message, result: null } },
          ]),
        ),
      },
    },
  });
}

// 토큰이 필요한 API에 붙여요. 자물쇠 표시와 함께 401 응답 세 가지를 문서에 남겨요.
export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(BEARER_AUTH),
    ApiFail(
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.AUTH_TOKEN_MISSING,
      ErrorCodes.AUTH_TOKEN_INVALID,
      ErrorCodes.AUTH_TOKEN_EXPIRED,
    ),
  );
}
