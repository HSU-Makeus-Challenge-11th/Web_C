import { type INestApplication, type Provider, type Type, ValidationPipe } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorite } from "../../src/entity/favorite.entity.js";
import { Member } from "../../src/entity/member.entity.js";
import { Rating } from "../../src/entity/rating.entity.js";
import { GlobalExceptionFilter } from "../../src/filter/global-exception.filter.js";

interface TestAppOptions {
  controllers: Type<unknown>[];
  providers: Provider[];
}

// 통합 테스트마다 반복되는 조립을 한곳에 모았어요.
// AppModule 전체(MySQL 연결)를 올리지 않고, 확인할 컨트롤러와 서비스만 메모리 DB 위에 올려요.
export async function createTestApp({ controllers, providers }: TestAppOptions): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      // 개발용 MySQL 대신 테스트가 돌 때만 메모리에 만들어지는 SQLite(sql.js)를 써요.
      // 테스트가 끝나면 흔적 없이 사라지므로 개발 DB의 데이터를 건드리지 않아요.
      TypeOrmModule.forRoot({
        type: "sqljs",
        autoSave: false,
        entities: [Member, Rating, Favorite],
        synchronize: true, // 엔티티를 보고 테이블과 UNIQUE 제약을 만들어요.
      }),
      TypeOrmModule.forFeature([Member, Rating, Favorite]),
      JwtModule.register({
        global: true,
        secret: "test-secret-for-e2e-only-at-least-32-chars",
        signOptions: { expiresIn: 3600 },
      }),
    ],
    controllers,
    providers,
  }).compile();

  const app = moduleFixture.createNestApplication();

  // main.ts에 붙인 전역 설정은 테스트 앱에 자동으로 따라오지 않아요.
  // 여기서 다시 붙여야 검증 실패 400과 { isSuccess, code, message, result } 형식의 오류 응답이 똑같이 나와요.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.init();
  return app;
}
