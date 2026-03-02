import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env
dotenv.config();

import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security: Helmet HTTP headers - disabling contentSecurityPolicy for local dev to avoid issues
  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  // CORS configuration
  app.enableCors({
    origin: '*', // Allow all for local dev
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('v1');

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // Global Exception Filter
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Serve uploads folder statically
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3005;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server listening on port ${port} with prefix /v1`);
  console.log(`CORS enabled for all origins`);
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
});
