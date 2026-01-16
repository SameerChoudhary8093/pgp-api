import { PrismaService } from '../prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(params: {
        actorUserId?: number | null;
        action: string;
        entityType: string;
        entityId: string;
        reason: string;
        metadata?: any;
    }): Promise<{
        id: number;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string;
        reason: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        actorUserId: number | null;
    }>;
}
