import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CategoryRepository } from '../category/category.repository';
import type { CreateBookRequestDto } from './dto/request/create-book.request.dto';
import { BookResponseDto } from './dto/response/book.response.dto';
import { CreateBookResponseDto } from './dto/response/create-book.response.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.findAll();
    return books.map((book) => new BookResponseDto(book));
  }

  async getBooksByCategory(categoryId: number): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.findByCategory(categoryId);
    return books.map((book) => new BookResponseDto(book));
  }

  async createBook(body: CreateBookRequestDto): Promise<CreateBookResponseDto> {
    if (!(await this.categoryRepository.exists(body.categoryId))) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    try {
      const bookId = await this.bookRepository.create({
        title: body.title,
        auth: body.auth,
        categoryId: body.categoryId,
      });
      return new CreateBookResponseDto(bookId);
    } catch (error) {
      // 존재 여부를 확인한 직후 카테고리가 삭제된 경우도 처리합니다.
      if (error instanceof Error && 'code' in error
        && error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException('카테고리를 찾을 수 없습니다.');
      }
      throw error;
    }
  }
}
