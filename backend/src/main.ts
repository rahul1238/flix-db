import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origin = (process.env.FRONTEND_URL || 'https://flixdb-4b041.web.app').replace(/\/$/,'',);
  app.enableCors({
    origin,
    methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
}
bootstrap();
