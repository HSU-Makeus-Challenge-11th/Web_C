import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { CategoryModule } from '../category/category.module';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { BookService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), CategoryModule],
  controllers: [BookController],
  providers: [BookService, BookRepository],
})
export class BookModule {}
