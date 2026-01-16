"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
async function handler(req, res) {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: true, credentials: true });
    await app.init();
    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
}
//# sourceMappingURL=index.js.map