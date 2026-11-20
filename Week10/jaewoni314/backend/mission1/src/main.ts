import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { GlobalExceptionFilter } from "./filter/global-exception.filter.js";
import { BEARER_AUTH } from "./swagger/api-docs.js";

// 10주차: 허용할 프론트 주소(Origin)를 코드에 고정하지 않고 환경변수로 받아요.
// 여러 개면 쉼표로 구분해요. 예) FRONTEND_ORIGIN=http://localhost:5173,https://umcine.vercel.app
// Origin은 "스킴://호스트[:포트]"까지만 같아야 해서, 끝에 /나 경로를 붙이면 브라우저의 Origin과 달라져 막혀요. 그래서 끝의 /는 지워요.
function getAllowedOrigins() {
  const origins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  return origins.length > 0 ? origins : ["http://localhost:5173"];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = getAllowedOrigins();
  app.enableCors({
    origin: allowedOrigins, // 이 출처에서 오는 요청만 허용
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

  // EC2 밖에서 들어오는 요청을 받도록 모든 네트워크 주소(0.0.0.0)에서 기다려요. (127.0.0.1만 열면 EC2 안에서만 접속돼요.)
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, "0.0.0.0");
  // 비밀 값은 남기지 않고, 어떤 환경으로 켜졌는지만 로그로 확인해요.
  console.log(`[${process.env.NODE_ENV ?? "local"}] http://0.0.0.0:${port} 에서 실행 중, CORS 허용: ${allowedOrigins.join(", ")}`);
}
await bootstrap();
