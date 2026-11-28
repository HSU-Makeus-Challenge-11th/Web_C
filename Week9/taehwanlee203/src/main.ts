// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './filter/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 문서의 표지에 해당하는 정보입니다.
  const config = new DocumentBuilder()
    .setTitle('영화 평점 서비스 API')
    .setDescription(
      'UMC 11기 백엔드 워크북에서 만든 회원/평점/즐겨찾기 API 문서입니다.',
    )
    .setVersion('v1')
    // 자물쇠 버튼(Authorize)에 쓸 인증 방식을 등록합니다.
    // 마지막 인자 'bearerAuth'는 각 API에서 @ApiBearerAuth('bearerAuth')로 연결할 때 쓰는 이름입니다.
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document); // <http://localhost:3000/swagger-ui>

  // 5주차에서 설정한 CORS입니다. 지우면 브라우저에서 우리 API를 부를 때 CORS 에러가 다시 납니다.
  app.enableCors({
    origin: '<http://localhost:5173>',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
