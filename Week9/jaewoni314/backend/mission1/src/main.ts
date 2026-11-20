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

  // http://localhost:3000/swagger-ui 에서 API 문서를 보고 바로 요청해 볼 수 있어요. (문서 JSON은 /swagger-ui-json)
  // Swagger 화면은 우리 컨트롤러가 아니라서 AuthGuard의 영향을 받지 않고, 토큰 없이 열려요.
  // 자물쇠가 있는 API는 로그인으로 받은 accessToken을 오른쪽 위 Authorize에 넣어야 해요.
  const swaggerConfig = new DocumentBuilder()
    .setTitle("UMC 영화 평점 API")
    .setDescription("UMC 11기 백엔드 워크북에서 만든 회원/인증/평점/즐겨찾기/영화 기록 API 문서입니다.")
    .setVersion("9")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, BEARER_AUTH)
    .build();
  SwaggerModule.setup("swagger-ui", app, () => SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
