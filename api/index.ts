const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../src/app.module');

let cachedServer;

module.exports = async (req, res) => {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule);
        app.enableCors({ origin: true, credentials: true });
        await app.init();
        cachedServer = app.getHttpAdapter().getInstance();
    }
    return cachedServer(req, res);
};
