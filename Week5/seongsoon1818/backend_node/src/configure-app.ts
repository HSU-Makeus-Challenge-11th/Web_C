import { ValidationPipe, type INestApplication } from '@nestjs/common';

export function configureApp(
  app: INestApplication,
  allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:5173',
) {
  app.enableCors({
    origin: allowedOrigins.trim() === '*'
      ? '*'
      : allowedOrigins.split(',').map((origin) => origin.trim()).filter(Boolean),
    methods: ['GET'],
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
}
