import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./entity/member.entity.js";
import { Rating } from "./entity/rating.entity.js";
import { Favorite } from "./entity/favorite.entity.js";
import { AuthController } from "./controller/auth.controller.js";
import { MemberController } from "./controller/member.controller.js";
import { RatingController } from "./controller/rating.controller.js";
import { FavoriteController } from "./controller/favorite.controller.js";
import { MovieRecordController } from "./controller/movie-record.controller.js";
import { AuthService } from "./service/auth.service.js";
import { MemberService } from "./service/member.service.js";
import { RatingService } from "./service/rating.service.js";
import { FavoriteService } from "./service/favorite.service.js";
import { MovieRecordService } from "./service/movie-record.service.js";

@Module({
  imports: [
    // 10주차: 환경마다 다른 설정 파일을 읽어요.
    // - 로컬(기본): .env.local → 내 컴퓨터의 MySQL
    // - 운영(NODE_ENV=production): .env.production → RDS. 이 파일은 EC2에만 두고 Git에 올리지 않아요. (키 목록은 .env.production.example)
    // EC2에서 export로 넘긴 값이 있으면 파일보다 실행 환경의 값이 우선이에요. (ConfigModule은 이미 있는 process.env를 덮어쓰지 않아요.)
    // 이 imports 배열은 위에서부터 평가되므로, 아래 TypeOrmModule.forRoot의 process.env를 읽기 전에 파일이 먼저 로드돼요.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306), // .env의 DB_PORT를 쓰고, 비어 있으면 MySQL 기본 포트를 써요.
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      // 운영 RDS에는 실제 회원의 평점과 즐겨찾기가 쌓여요. 앱이 켜질 때 엔티티를 보고 테이블을 바꾸지 않도록 모든 환경에서 꺼 둬요.
      // 스키마는 sql/01_schema_seed.sql로 미리 만들고, 9주차 테스트만 메모리 DB(sql.js)에서 synchronize: true를 써요.
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Member, Rating, Favorite]),
    JwtModule.registerAsync({
      global: true, // 전역으로 등록해서 어느 서비스나 Guard에서든 JwtService를 주입받을 수 있어요.
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 짧은 비밀키는 추측해서 토큰을 위조할 수 있고, 빈 비밀키로는 토큰을 만들지 못해 로그인할 때마다 500이 나요.
        // 둘 다 로그인할 때가 아니라 서버를 켤 때 바로 막아요.
        const secret = configService.get<string>("JWT_SECRET") ?? "";
        if (secret.length < 32) {
          throw new Error("JWT_SECRET을 32자 이상으로 .env에 넣어 주세요.");
        }

        // 환경변수는 문자열로 들어오므로 초 단위 숫자로 바꿔요. 값이 없거나 비어 있으면 3600초(1시간)를 써요.
        // "1h"처럼 숫자가 아니거나 0 이하이면 토큰을 만들지 못하거나 바로 만료되니, 이것도 서버를 켤 때 막아요.
        const expiresIn = Number(configService.get<string>("JWT_ACCESS_EXPIRATION") || 3600);
        if (!Number.isSafeInteger(expiresIn) || expiresIn <= 0) {
          throw new Error("JWT_ACCESS_EXPIRATION은 초 단위 양의 정수로 넣어 주세요. (예: 3600)");
        }

        return {
          secret,
          signOptions: { expiresIn },
          // 서명할 때 쓰는 HS256으로 만든 토큰만 받아요.
          verifyOptions: { algorithms: ["HS256"] },
        };
      },
    }),
  ],
  controllers: [AuthController, MemberController, RatingController, FavoriteController, MovieRecordController],
  providers: [AuthService, MemberService, RatingService, FavoriteService, MovieRecordService],
})
export class AppModule {}
