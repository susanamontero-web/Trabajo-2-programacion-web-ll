import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  configureApp(app);
  await app.listen(config.get<number>('PORT', 3000));
}
bootstrap().catch((error: unknown) => {
  console.error('No se pudo iniciar el backend.', error);
  process.exitCode = 1;
});
