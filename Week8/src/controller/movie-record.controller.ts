// src/controller/movie-record.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateMovieRecordDto } from '../dto/create-movie-record.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';
import { MovieRecordService } from '../service/movie-record.service.js';

interface AuthenticatedRequest extends Request {
  memberId: number;
}

@Controller('movie-records')
@UseGuards(AuthGuard)
export class MovieRecordController {
  constructor(private readonly movieRecordService: MovieRecordService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateMovieRecordDto,
  ) {
    const memberId = request.memberId as number;
    const result = await this.movieRecordService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '영화 기록을 저장했습니다.',
      result,
    };
  }
}
