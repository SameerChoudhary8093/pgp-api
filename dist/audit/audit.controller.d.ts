import { AuditService } from './audit.service';
import { PrismaService } from '../prisma.service';
export declare class AuditController {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    list(limit?: string): Promise<{
        logs: ({
            actor: {
                name: string;
                phone: string;
                id: number;
            } | null;
        } & {
            actorUserId: number | null;
            action: string;
            entityType: string;
            entityId: string;
            reason: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            id: number;
        })[];
    }>;
}
