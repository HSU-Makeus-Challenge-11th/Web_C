import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { BookResponseDto } from './dto/book-response.dto.js';
import { CreateBookDto } from './dto/create-book.dto.js';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // GET /books, GET /books?keyword=코드
  @Get()
  getBooks(@Query('keyword') keyword?: string): Promise<BookResponseDto[]> {
    return this.booksService.getBooks(keyword);
  }

  // POST /books → 성공 시 201 (Nest의 @Post 기본 상태 코드)
  @Post()
  createBook(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return this.booksService.createBook(dto);
  }
}
