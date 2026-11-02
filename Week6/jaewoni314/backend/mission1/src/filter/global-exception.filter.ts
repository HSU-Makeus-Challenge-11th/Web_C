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

// MySQL 중복 오류(ER_DUP_ENTRY)라면 "Duplicate entry '...' for key 'member.email'"의 key 이름을 꺼내요.
function getDuplicateKey(exception: unknown): string | null {
  if (!(exception instanceof QueryFailedError)) return null;
  const driverError = exception.driverError as { code?: string; sqlMessage?: string };
  if (driverError.code !== "ER_DUP_ENTRY") return null;
  return driverError.sqlMessage?.match(/for key '([^']+)'/)?.[1] ?? "";
}
