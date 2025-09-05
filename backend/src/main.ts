import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // FRONTEND_URL can be a single URL, comma-separated list, or JSON array
  const rawFrontend = process.env.FRONTEND_URL || 'http://localhost:3000';
  const toArray = (val: string): string[] => {
    try {
      const trimmed = val.trim();
      if (trimmed.startsWith('[')) {
        const arr = JSON.parse(trimmed);
        return Array.isArray(arr) ? arr : [val];
      }
    } catch {}
    return val.split(',');
  };
  const normalize = (s: string) => s.replace(/\/$/, '').trim();
  const allowedOrigins = toArray(rawFrontend).map(normalize).filter(Boolean);

  app.enableCors({
    origin: (reqOrigin, callback) => {
      if (!reqOrigin) return callback(null, true);
      const ok = allowedOrigins.includes(normalize(reqOrigin));
      return callback(null, ok);
    },
    methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
}
bootstrap();
