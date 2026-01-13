import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CommitteesService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async createCommittee(name: string, localUnitId: number, type: string, actorUserId: number, reason?: string) {
    const lu = await this.prisma.localUnit.findUnique({ where: { id: localUnitId } });
    if (!lu) throw new BadRequestException('Invalid localUnitId');
    const committee = await this.prisma.committee.create({ data: { name, localUnitId, type: type as any } });
    await this.audit.log({
      actorUserId,
      action: 'COMMITTEE_CREATE',
      entityType: 'Committee',
      entityId: String(committee.id),
      reason: reason ?? '',
      metadata: { name, type, localUnitId },
    });
    return committee;
  }

  async addMember(committeeId: number, userId: number, role: string, makePresident: boolean, actorUserId: number, reason?: string) {
    const committee = await this.prisma.committee.findUnique({ where: { id: committeeId } });
    if (!committee) throw new NotFoundException('Committee not found');

    if (makePresident && role !== 'CWCPresident') role = 'CWCPresident';

    const data: any = {
      userId,
      committeeId,
      role,
      isPresident: makePresident,
    };

    // Ensure single president per committee
    if (makePresident) {
      await this.prisma.committeeMember.updateMany({ where: { committeeId, isPresident: true }, data: { isPresident: false } });
    }

    await this.prisma.committeeMember.upsert({
      where: { userId_committeeId: { userId, committeeId } },
      update: data,
      create: data,
    });

    // Update user's top-level role to reflect highest designation
    const userRole = makePresident ? 'CWCPresident' : role;
    await this.prisma.user.update({ where: { id: userId }, data: { role: userRole as any } });

    await this.audit.log({
      actorUserId,
      action: makePresident ? 'COMMITTEE_SET_PRESIDENT' : 'COMMITTEE_ADD_MEMBER',
      entityType: 'Committee',
      entityId: String(committeeId),
      reason: reason ?? '',
      metadata: { userId, role: userRole },
    });

    return { ok: true };
  }

  async myTeam(presidentUserId: number) {
    const pres = await this.prisma.committeeMember.findFirst({
      where: { userId: presidentUserId, isPresident: true },
      include: { committee: true },
    });
    if (!pres) return { committee: null, members: [] };

    const members = await this.prisma.committeeMember.findMany({
      where: { committeeId: pres.committeeId, role: { in: ['CWCMember', 'ExtendedMember'] as any } },
      include: { user: { select: { id: true, name: true, phone: true, role: true } } },
      orderBy: { userId: 'asc' },
    });
    return { committee: { id: pres.committee.id, name: pres.committee.name }, members };
  }
}
