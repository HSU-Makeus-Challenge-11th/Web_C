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
import { CreateMovieRecordDto } from '../dto/create-movie-record.dto';
import { AuthGuard } from '../guard/auth.guard';
import { MovieRecordService } from '../service/movie-record.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('영화 기록')
@ApiBearerAuth('bearerAuth')
@Controller('movie-records')
@UseGuards(AuthGuard)
export class MovieRecordController {
  constructor(private readonly movieRecordService: MovieRecordService) {}

  @ApiOperation({ summary: '영화 기록 등록', description: '평점과 선택한 즐겨찾기를 함께 저장합니다. Bearer 토큰이 필요합니다.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateMovieRecordDto) {
    const memberId = request['memberId'] as number;
    const result = await this.movieRecordService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '영화 기록을 저장했습니다.',
      result,
    };
  }
}
