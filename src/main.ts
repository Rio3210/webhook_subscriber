import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all endpoints
  app.enableCors({ origin: true });

  await app.listen(4200);
}
bootstrap();
