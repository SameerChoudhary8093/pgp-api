import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma.service';

@Controller('audit')
export class AuditController {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  @Get('logs')
  async list(@Query('limit') limit?: string) {
    const take = Math.min(Math.max(parseInt(limit || '50', 10) || 50, 1), 200);
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { id: 'desc' },
      take,
      include: { actor: { select: { id: true, name: true, phone: true } } },
    });
    return { logs };
  }
}
