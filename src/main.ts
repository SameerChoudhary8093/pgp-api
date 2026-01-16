import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
      origin: true,
      credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

    // Serve uploads folder statically
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  bootstrap().then(async (app) => {
    const port = process.env.PORT ? Number(process.env.PORT) : 3002;
    const server = await NestFactory.create<NestExpressApplication>(AppModule);
    // We recreate it for local listen to keep it simple or just reuse cachedApp with listen
    // But for simplicity in Vercel environment, we export.
    // Let's just use a simple condition.
  });
}

// Export for Vercel
const handler = async (req: any, res: any) => {
  const app = await bootstrap();
  return app(req, res);
};

export default handler;

// Force commonjs export for Vercel to ensure it finds the entry point
if (typeof module !== 'undefined') {
  module.exports = handler;
}


