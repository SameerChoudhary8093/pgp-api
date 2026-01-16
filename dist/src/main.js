"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
let cachedApp;
async function bootstrap() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: true,
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
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
        const server = await core_1.NestFactory.create(app_module_1.AppModule);
    });
}
const handler = async (req, res) => {
    const app = await bootstrap();
    return app(req, res);
};
exports.default = handler;
if (typeof module !== 'undefined') {
    module.exports = handler;
}
//# sourceMappingURL=main.js.map