import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Explicitly load .env from the current directory
console.log('Current CWD:', process.cwd());
console.log('Current __dirname:', __dirname);

let envPath = path.resolve(process.cwd(), '.env');
let result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn('Failed to load .env from CWD. Trying relative to __dirname...');
  // __dirname is usually dist/src. We need to go up to apps/api root.
  envPath = path.resolve(__dirname, '../../.env');
  result = dotenv.config({ path: envPath });
}

if (result.error) {
  console.log('CRITICAL: Error loading .env file from ' + envPath, result.error);
} else {
  console.log('.env loaded successfully from ' + envPath + '. DATABASE_URL is ' + (process.env.DATABASE_URL ? 'set' : 'MISSING'));
}

// Fallback hardcoded values
if (!process.env.DATABASE_URL) {
  console.warn('Applying Hardcoded Fallback for DATABASE_URL');
  process.env.DATABASE_URL = 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:6543/postgres?pgbouncer=true';
}
if (!process.env.SUPABASE_JWKS_URL) {
  console.warn('Applying Hardcoded Fallback for SUPABASE_JWKS_URL');
  process.env.SUPABASE_JWKS_URL = 'https://jgtseacyfwgbpltvlxno.supabase.co/auth/v1/jwks';
}
if (!process.env.AUTH_DEV_MODE) {
  process.env.AUTH_DEV_MODE = 'true';
}

import { NestFactory, HttpAdapterHost } from '@nestjs/core'; // Combined import
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionsFilter } from './all-exceptions.filter'; // moved here

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
      origin: true, // Allow any origin
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Global Pipes
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

    // Global Exception Filter
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    // Serve uploads folder statically
    // Use process.cwd() to match the upload service path (apps/api/uploads)
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
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
    await app.listen(port);
    console.log(`Server listening on port ${port}`);
  });
}

// Export for Vercel
const handler = async (req: any, res: any) => {
  try {
    const app = await bootstrap();
    return app(req, res);
  } catch (err: any) {
    console.error('Bootstrap error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message, stack: err.stack }));
  }
};

export default handler;

// Force commonjs export for Vercel to ensure it finds the entry point
if (typeof module !== 'undefined') {
  module.exports = handler;
}


