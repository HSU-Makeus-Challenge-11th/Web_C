import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { API_ERRORS } from '../error/api-errors';
import { ApiException } from '../exception/api.exception';

interface MySqlError extends Error {
  code?: string;
  errno?: number;
  sqlMessage?: string;
}

function getDuplicateError(error: MySqlError) {
  // mysql2 exposes the constraint name inside the message, not as a separate field.
  const key = (error.sqlMessage ?? error.message)
    .match(/for key '([^']+)'\s*$/i)?.[1]
    .split('.')
    .pop();

  switch (key) {
    case 'email':
      return API_ERRORS.duplicateEmail;
    case 'nickname':
      return API_ERRORS.duplicateNickname;
    case 'uk_rating_member_movie':
      return API_ERRORS.duplicateRating;
    default:
      return API_ERRORS.duplicateData;
  }
}

@Catch(HttpException, JsonWebTokenError, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(
    exception: HttpException | JsonWebTokenError | QueryFailedError<MySqlError>,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'COMMON500';
    let message = '서버 내부 오류가 발생했습니다.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code =
        exception instanceof ApiException ? exception.code : 'COMMON' + status;
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else {
        const payload = body as { code?: unknown; message?: unknown };
        if (typeof payload.code === 'string') code = payload.code;
        const detail = Array.isArray(payload.message)
          ? payload.message[0]
          : payload.message;
        message = typeof detail === 'string' ? detail : exception.message;
      }
    } else if (exception instanceof JsonWebTokenError) {
      status = HttpStatus.UNAUTHORIZED;
      ({ code, message } =
        exception instanceof TokenExpiredError
          ? API_ERRORS.expiredToken
          : API_ERRORS.invalidToken);
    } else {
      const error = exception.driverError;
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        status = HttpStatus.CONFLICT;
        ({ code, message } = getDuplicateError(error));
      } else {
        this.logger.error(
          `Database request failed (${error.code ?? 'unknown'}).`,
        );
      }
    }

    response.status(status).json({
      isSuccess: false,
      code,
      message,
      result: null,
    });
  }
}
