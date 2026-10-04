import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookRequestDto } from './dto/request/create-book.request.dto';
import { FindBooksByCategoryRequestDto } from './dto/request/find-books-by-category.request.dto';
import { BookResponseDto } from './dto/response/book.response.dto';
import { CreateBookResponseDto } from './dto/response/create-book.response.dto';

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }

  @Get('category/:categoryId')
  getBooksByCategory(@Param() params: FindBooksByCategoryRequestDto): Promise<BookResponseDto[]> {
    return this.bookService.getBooksByCategory(params.categoryId);
  }

  // POST http://localhost:3000/books
  @Post()
  async createBook(@Body() body: CreateBookRequestDto): Promise<CreateBookResponseDto> {
    return await this.bookService.createBook(body);
  }
}
