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
import { AuthService } from "./service/auth.service.js";
import { MemberService } from "./service/member.service.js";
import { RatingService } from "./service/rating.service.js";
import { FavoriteService } from "./service/favorite.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306), // .env의 DB_PORT를 쓰고, 비어 있으면 MySQL 기본 포트를 써요.
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
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
  controllers: [AuthController, MemberController, RatingController, FavoriteController],
  providers: [AuthService, MemberService, RatingService, FavoriteService],
})
export class AppModule {}
