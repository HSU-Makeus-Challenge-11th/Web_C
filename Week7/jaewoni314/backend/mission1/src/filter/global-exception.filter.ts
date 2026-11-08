import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";
import { QueryFailedError } from "typeorm";
import { ApiException } from "../common/api.exception.js";
import { ApiResponse } from "../common/api-response.js";
import { type ErrorCode, ErrorCodes } from "../common/error-code.js";

// UNIQUE 제약 이름(MySQL 오류 메시지의 key)별로 어떤 중복 오류인지 정해요.
const DUPLICATE_KEY_ERRORS: Record<string, ErrorCode> = {
  "member.email": ErrorCodes.MEMBER_EMAIL_DUPLICATED,
  "member.nickname": ErrorCodes.MEMBER_NICKNAME_DUPLICATED,
  "rating.uk_rating_member_movie": ErrorCodes.RATING_DUPLICATED,
};

// 어디에서 오류가 나도 { isSuccess: false, code, message, result: null } 형식으로 응답해요.
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const error = this.toErrorCode(exception);
    response.status(error.status).json(ApiResponse.fail(error.code, error.message));
  }

  private toErrorCode(exception: unknown): ErrorCode {
    if (exception instanceof ApiException) {
      return exception.error;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      // ValidationPipe는 실패한 규칙의 메시지를 배열로 주므로, 첫 번째 메시지만 보여 줘요.
      const message = typeof body === "string" ? body : (body as { message: string | string[] }).message;
      return {
        status,
        code: `COMMON${status}`,
        message: Array.isArray(message) ? message[0] : message,
      };
    }

    // 요청 본문이 너무 크거나(413) 문자셋이나 압축 방식을 지원하지 않으면(415) body-parser가 HttpException이 아닌 오류를 던져요.
    // 클라이언트가 고쳐야 하는 오류라 500으로 바꾸지 않고, 그 오류에 담긴 상태 코드로 응답해요.
    const clientError = getClientError(exception);
    if (clientError) {
      return clientError;
    }

    // 서비스의 중복 확인을 통과해도, 동시에 들어온 요청은 DB의 UNIQUE 제약에서 막힐 수 있어요.
    const duplicateKey = getDuplicateKey(exception);
    if (duplicateKey) {
      this.logger.warn(`DB UNIQUE 제약 위반(${duplicateKey})을 409 응답으로 바꿨어요.`);
      return (
        DUPLICATE_KEY_ERRORS[duplicateKey] ?? {
          status: HttpStatus.CONFLICT,
          code: "COMMON409",
          message: "이미 존재하는 데이터입니다.",
        }
      );
    }

    this.logger.error(exception);
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: "COMMON500",
      message: "서버 내부 오류가 발생했습니다.",
    };
  }
}

// body-parser처럼 http-errors 형식(status, expose)으로 던진 4xx 오류라면 그 상태 코드와 메시지를 써요.
function getClientError(exception: unknown): ErrorCode | null {
  const error = exception as { status?: unknown; expose?: unknown; message?: unknown } | null | undefined;
  if (typeof error?.status !== "number" || error.status < 400 || error.status >= 500 || error.expose !== true) {
    return null;
  }
  return { status: error.status, code: `COMMON${error.status}`, message: String(error.message) };
}

// MySQL 중복 오류(ER_DUP_ENTRY)라면 "Duplicate entry '...' for key 'member.email'"의 key 이름을 꺼내요.
function getDuplicateKey(exception: unknown): string | null {
  if (!(exception instanceof QueryFailedError)) return null;
  const driverError = exception.driverError as { code?: string; sqlMessage?: string };
  if (driverError.code !== "ER_DUP_ENTRY") return null;
  return driverError.sqlMessage?.match(/for key '([^']+)'/)?.[1] ?? "";
}
