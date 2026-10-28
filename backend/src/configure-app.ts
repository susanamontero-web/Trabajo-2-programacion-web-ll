import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureApp(app: INestApplication) {
  const config = app.get(ConfigService);
  app.enableCors({
    origin: config.get<string>('FRONTEND_URL', 'http://localhost:5173'),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
