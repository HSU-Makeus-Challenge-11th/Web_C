// src/database.provider.ts
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

// 의존성 주입(DI)에 사용할 우리만의 고유 이름표(토큰)
export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return mysql.createPool({
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        user: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', '1234'),
        database: configService.get<string>('DB_NAME', 'umc_missiondb'),
        waitForConnections: true, // 선로가 꽉 차면 에러 대신 대기
        connectionLimit: 10,      // 미리 뚫어둘 핫라인(커넥션) 개수 10개
        queueLimit: 0,
      });
    },
  },
];