// src/book.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { PositiveIntPipe } from './positive-int.pipe';

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  @Get('category/:categoryId')
  getBooksByCategory(@Param('categoryId', PositiveIntPipe) categoryId: number) {
    return this.bookService.getBooksByCategory(categoryId);
  }

  // POST http://localhost:3000/books
  @Post()
  async createBook(@Body() body: Record<string, any>): Promise<string> {
    return await this.bookService.createBook(body);
  }
}
