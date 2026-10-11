import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Book } from '../book/book.entity';
import { Category } from '../category/category.entity';
import { Rental } from '../rental/rental.entity';
import { User } from '../user/user.entity';

export function createDatabaseOptions(config: ConfigService): TypeOrmModuleOptions {
  const port = Number(config.get<string>('DB_PORT', '3306'));
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT는 1~65535 사이의 정수여야 합니다.');
  }

  return {
    type: 'mysql',
    host: config.get<string>('DB_HOST', 'localhost'),
    port,
    username: config.getOrThrow<string>('DB_USER'),
    password: config.getOrThrow<string>('DB_PASSWORD'),
    database: config.getOrThrow<string>('DB_NAME'),
    // 관계에 참조되는 User까지 등록합니다. 기존 컬럼/외래 키는 변경하지 않습니다.
    entities: [Book, Category, Rental, User],
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    retryAttempts: 3,
    retryDelay: 1000,
    extra: { connectionLimit: 10 },
  };
}
