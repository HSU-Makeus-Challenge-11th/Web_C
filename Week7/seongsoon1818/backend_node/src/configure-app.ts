import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http-exception.filter';

export function configureApp(
  app: INestApplication,
  allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:5173',
) {
  app.enableCors({
    origin:
      allowedOrigins.trim() === '*'
        ? '*'
        : allowedOrigins
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
}
