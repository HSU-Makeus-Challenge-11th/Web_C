import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { GlobalExceptionFilter } from "./filter/global-exception.filter.js";
import { BEARER_AUTH } from "./swagger/api-docs.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:5173", // 이 출처에서 오는 요청만 허용
    methods: ["GET", "POST", "PATCH", "DELETE"],
  });

  // whitelist: DTO에 없는 값은 지우고, forbidNonWhitelisted: 그런 값이 들어오면 400으로 막아요.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());

  // http://localhost:3000/docs 에서 API 문서를 보고 바로 요청해 볼 수 있어요.
  // 자물쇠가 있는 API는 로그인으로 받은 accessToken을 오른쪽 위 Authorize에 넣어야 해요.
  const swaggerConfig = new DocumentBuilder()
    .setTitle("UMC 영화 평점 API")
    .setDescription("8주차: 즐겨찾기와 영화 기록(평점 + 즐겨찾기 트랜잭션) API")
    .setVersion("8")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, BEARER_AUTH)
    .build();
  SwaggerModule.setup("docs", app, () => SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
