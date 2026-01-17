"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
console.log('Current CWD:', process.cwd());
console.log('Current __dirname:', __dirname);
let envPath = path.resolve(process.cwd(), '.env');
let result = dotenv.config({ path: envPath });
if (result.error) {
    console.warn('Failed to load .env from CWD. Trying relative to __dirname...');
    envPath = path.resolve(__dirname, '../../.env');
    result = dotenv.config({ path: envPath });
}
if (result.error) {
    console.log('CRITICAL: Error loading .env file from ' + envPath, result.error);
}
else {
    console.log('.env loaded successfully from ' + envPath + '. DATABASE_URL is ' + (process.env.DATABASE_URL ? 'set' : 'MISSING'));
}
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
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const all_exceptions_filter_1 = require("./all-exceptions.filter");
let cachedApp;
async function bootstrap() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: false,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        const httpAdapter = app.get(core_1.HttpAdapterHost);
        app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapter));
        app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
            prefix: '/uploads/',
        });
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp;
}
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    bootstrap().then(async (app) => {
        const port = process.env.PORT ? Number(process.env.PORT) : 3002;
        await app.listen(port);
        console.log(`Server listening on port ${port}`);
    });
}
const handler = async (req, res) => {
    try {
        const app = await bootstrap();
        return app(req, res);
    }
    catch (err) {
        console.error('Bootstrap error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message, stack: err.stack }));
    }
};
exports.default = handler;
if (typeof module !== 'undefined') {
    module.exports = handler;
}
//# sourceMappingURL=main.js.map