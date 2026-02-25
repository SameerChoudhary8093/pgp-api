import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PromotionService {
  private readonly logger = new Logger(PromotionService.name);

  constructor(private prisma: PrismaService) {}

  async checkAndPromote(referrerUserId: number) {
    const referrer = await this.prisma.user.findUnique({
      where: { id: referrerUserId },
      include: {
        recruits: {
          // Only recruits who are NOT already in any committee
          where: { committeeMemberships: { none: {} } },
          include: { localUnit: true },
          orderBy: { id: 'asc' },
        },
        localUnit: true,
        committeeMemberships: true,
      },
    });

    if (!referrer || !referrer.localUnit) return;

    // If the referrer is already in a leadership role, do not promote again
    const leaderRoles = ['CWCPresident', 'APC', 'PPC', 'SSP', 'ALCPresident', 'SLCPresident'];
    if (leaderRoles.includes(referrer.role as any)) {
      this.logger.log(
        `User ${referrer.id} is already a leader (${referrer.role}). Skipping promotion.`,
      );
      return;
    }

    // Geo‑fence: only recruits from the SAME Local Unit
    const localRecruits = referrer.recruits.filter(
      (r: any) => r.localUnitId === referrer.localUnitId,
    );

    this.logger.log(
      `User ${referrer.id} (${referrer.name}) has ${localRecruits.length} valid local recruits in unit ${referrer.localUnitId}.`,
    );

    // Threshold: need at least 5 local recruits
    if (localRecruits.length < 5) return;

    await this.promoteToPresident(referrer as any, localRecruits.slice(0, 5) as any[]);
  }

  private async promoteToPresident(president: any, coreTeam: any[]) {
    // Calculate per‑unit sequence number purely for naming (CWC Ward 1, CWC Ward 1 2, ...)
    const count = await this.prisma.committee.count({
      where: { localUnitId: president.localUnitId, type: 'CWC' as any },
    });
    const nextSeq = count + 1;
    const committeeName = `CWC ${president.localUnit.name} ${nextSeq}`;

    await this.prisma.$transaction(async (tx) => {
      // Breakaway: if president was in other teams, remove those memberships
      if (president.committeeMemberships?.length > 0) {
        await tx.committeeMember.deleteMany({
          where: { userId: president.id },
        });
      }

      const committee = await tx.committee.create({
        data: {
          name: committeeName,
          localUnitId: president.localUnitId,
          type: 'CWC' as any,
        },
      });

      await tx.user.update({
        where: { id: president.id },
        data: { role: 'CWCPresident' as any },
      });

      await tx.committeeMember.create({
        data: {
          userId: president.id,
          committeeId: committee.id,
          role: 'CWCPresident' as any,
          isPresident: true,
        },
      });

      for (const member of coreTeam) {
        await tx.user.update({
          where: { id: member.id },
          data: { role: 'CWCMember' as any },
        });

        await tx.committeeMember.create({
          data: {
            userId: member.id,
            committeeId: committee.id,
            role: 'CWCMember' as any,
            isPresident: false,
          },
        });
      }
    });

    this.logger.log(`🎉 NEW CELL FORMED: ${committeeName} led by ${president.name}`);
  }
}
