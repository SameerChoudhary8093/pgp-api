import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from './prisma.service';
export declare class HealthController {
    private readonly health;
    private readonly db;
    private readonly prisma;
    constructor(health: HealthCheckService, db: PrismaHealthIndicator, prisma: PrismaService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
