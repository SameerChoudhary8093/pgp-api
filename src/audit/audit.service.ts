import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    actorUserId?: number | null;
    action: string;
    entityType: string;
    entityId: string;
    reason: string;
    metadata?: any;
  }) {
    const { actorUserId = null, action, entityType, entityId, reason, metadata } = params;
    return this.prisma.auditLog.create({
      data: {
        actorUserId: actorUserId ?? undefined,
        action,
        entityType,
        entityId,
        reason,
        metadata,
      },
    });
  }
}
