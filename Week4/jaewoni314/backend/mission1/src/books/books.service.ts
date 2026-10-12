import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { BookResponseDto } from './dto/book-response.dto.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 실습 1 + 선택 2. 최신 등록순 목록, keyword가 있으면 제목 검색
  async getBooks(keyword?: string): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      where: keyword ? { title: Like(`%${keyword}%`) } : {},
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
    return books.map((book) => BookResponseDto.from(book));
  }

  // 실습 2. 신규 도서 등록
  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.categoryRepository.findOneBy({
      categoryId: dto.categoryId,
    });
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    const book = this.bookRepository.create({
      category,
      title: dto.title,
      description: dto.description ?? null,
    });

    try {
      return BookResponseDto.from(await this.bookRepository.save(book));
    } catch (error) {
      // 선택 3. title UNIQUE 제약 위반이면 409로 알려요.
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException('이미 등록된 도서 제목입니다.');
      }
      throw error;
    }
  }
}
