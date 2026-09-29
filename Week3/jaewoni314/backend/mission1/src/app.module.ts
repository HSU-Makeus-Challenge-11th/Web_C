import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.provider.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';
import { BookRepository } from './book.repository.js';
import { RentalController } from './rental.controller.js';
import { RentalService } from './rental.service.js';
import { RentalRepository } from './rental.repository.js';

@Module({
  imports: [
    // 환경 변수를 애플리케이션 전역에서 사용 가능하도록 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, BookController, RentalController],
  providers: [
    ...databaseProviders, // DB 커넥션 풀을 부품으로 등록
    AppService,
    BookService,
    BookRepository,
    RentalService,
    RentalRepository,
  ],
  exports: [...databaseProviders], // 다른 모듈에서도 쓸 수 있게 공개
})
export class AppModule {}
