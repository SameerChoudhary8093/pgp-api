import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';
import { AddCandidateDto } from './dto/add-candidate.dto';
import { CloseElectionDto } from './dto/close-election.dto';
import { CreateElectionDto } from './dto/create-election.dto';
import { VoteDto } from './dto/vote.dto';
// Avoid importing Prisma enums at runtime; use string literals
import { CreateApcElectionsDto } from './dto/create-apc-elections.dto';

@Injectable()
export class ElectionsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async createElection(dto: CreateElectionDto) {
    const election = await this.prisma.election.create({
      data: {
        councilLevel: dto.councilLevel as any,
        position: dto.position || 'President',
        status: 'Active',
        openedAt: new Date(),
      },
    });

    await this.audit.log({
      actorUserId: dto.actorUserId ?? null,
      action: 'ELECTION_CREATE',
      entityType: 'Election',
      entityId: String(election.id),
      reason: dto.reason,
      metadata: { councilLevel: election.councilLevel, position: election.position },
    });

    return election;
  }

  async addCandidate(electionId: number, dto: AddCandidateDto) {
    const election = await this.prisma.election.findUnique({ where: { id: electionId } });
    if (!election) throw new NotFoundException('Election not found');
    if (String(election.status) !== 'Active') throw new BadRequestException('Election is not active');

    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    // For APC elections, candidate must be CWCPresident or CWCMember and belong to same Vidhan Sabha (new hierarchy)
    if (String(election.councilLevel) === 'APC') {
      if (!(user.role === 'CWCPresident' || user.role === 'CWCMember')) {
        throw new BadRequestException('Only CWC President/Member can be candidates for APC');
      }
      if (!election.vidhansabhaId) throw new BadRequestException('Election is missing Vidhan Sabha');
      if (!user.localUnitId) throw new BadRequestException('Candidate must have a Local Unit');
      const lu = await this.prisma.localUnit.findUnique({ where: { id: user.localUnitId }, select: { vidhansabhaId: true } });
      if (!lu) throw new BadRequestException('Candidate local unit not found');
      if (lu.vidhansabhaId !== election.vidhansabhaId) throw new BadRequestException('Candidate must belong to the Vidhan Sabha');
    }

    try {
      const candidate = await this.prisma.candidate.create({
        data: { electionId, userId: dto.userId },
      });

      await this.audit.log({
        actorUserId: dto.actorUserId ?? null,
        action: 'CANDIDATE_ADD',
        entityType: 'Election',
        entityId: String(electionId),
        reason: dto.reason,
        metadata: { candidateUserId: dto.userId },
      });

      return candidate;
    } catch (err: any) {
      if (String(err?.message || '').includes('Unique constraint failed')) {
        throw new BadRequestException('User is already a candidate in this election');
      }
      throw err;
    }
  }

  async closeElection(electionId: number, dto: CloseElectionDto) {
    const election = await this.prisma.election.findUnique({ where: { id: electionId } });
    if (!election) throw new NotFoundException('Election not found');
    if (String(election.status) !== 'Active') throw new BadRequestException('Election already closed');

    const closed = await this.prisma.election.update({
      where: { id: electionId },
      data: { status: 'Closed', closedAt: new Date() },
    });

    await this.audit.log({
      actorUserId: dto.actorUserId ?? null,
      action: 'ELECTION_CLOSE',
      entityType: 'Election',
      entityId: String(electionId),
      reason: dto.reason,
    });

    // If APC, promote top 21 vote-getters to APC
    if (String(election.councilLevel) === 'APC') {
      const grouped = await this.prisma.vote.groupBy({
        by: ['candidateUserId'],
        where: { electionId },
        _count: { _all: true },
      });
      const withCounts = await Promise.all(
        grouped.map(async (g) => ({
          candidateUserId: g.candidateUserId,
          votes: g._count._all,
        }))
      );
      withCounts.sort((a, b) => b.votes - a.votes || a.candidateUserId - b.candidateUserId);
      const winners = withCounts.slice(0, 21).map((w) => w.candidateUserId);
      for (const uid of winners) {
        await this.prisma.user.update({ where: { id: uid }, data: { role: 'APC' } });
        await this.audit.log({
          actorUserId: dto.actorUserId ?? null,
          action: 'ELECTION_PROMOTE_WINNER',
          entityType: 'User',
          entityId: String(uid),
          reason: 'APC election winner promotion',
          metadata: { electionId },
        });
      }
    }

    return closed;
  }

  async list() {
    const elections = await this.prisma.election.findMany({ orderBy: { id: 'desc' } });
    return elections;
  }

  async detail(electionId: number) {
    const election = await this.prisma.election.findUnique({ where: { id: electionId } });
    if (!election) throw new NotFoundException('Election not found');

    const candidates = await this.prisma.candidate.findMany({
      where: { electionId },
      include: { user: { select: { id: true, name: true, phone: true } } },
    });

    // Votes per candidate
    const grouped = await this.prisma.vote.groupBy({
      by: ['candidateUserId'],
      where: { electionId },
      _count: { _all: true },
    });
    const voteCountMap = new Map<number, number>();
    grouped.forEach((g) => voteCountMap.set(g.candidateUserId, g._count._all));

    const withCounts = candidates.map((c) => ({
      id: c.id,
      user: c.user,
      votes: voteCountMap.get(c.userId) || 0,
    }));

    return { election, candidates: withCounts };
  }

  async vote(electionId: number, voterUserId: number, dto: VoteDto) {
    const election = await this.prisma.election.findUnique({ where: { id: electionId } });
    if (!election) throw new NotFoundException('Election not found');
    if (String(election.status) !== 'Active') throw new BadRequestException('Election is not active');

    // Enforce voter eligibility for APC (Vidhan Sabha-wide)
    if (String(election.councilLevel) === 'APC') {
      const voter = await this.prisma.user.findUnique({ where: { id: voterUserId } });
      if (!voter) throw new BadRequestException('Voter not found');
      if (!(voter.role === 'CWCPresident' || voter.role === 'CWCMember')) {
        throw new BadRequestException('Only CWC President/Member can vote in APC');
      }
      if (!election.vidhansabhaId) throw new BadRequestException('Election is missing Vidhan Sabha');
      if (!voter.localUnitId) throw new BadRequestException('Voter local unit not set');
      const lu = await this.prisma.localUnit.findUnique({ where: { id: voter.localUnitId }, select: { vidhansabhaId: true } });
      if (!lu) throw new BadRequestException('Voter local unit not found');
      if (lu.vidhansabhaId !== election.vidhansabhaId) throw new BadRequestException('Voter not assigned to this Vidhan Sabha');
    }

    const candidateIds = Array.from(new Set(dto.candidateUserIds || []));
    if (candidateIds.length === 0 || candidateIds.length > 21) throw new BadRequestException('Select between 1 and 21 candidates');

    // Ensure all candidates belong to election
    const candidates = await this.prisma.candidate.findMany({
      where: { electionId, userId: { in: candidateIds } },
      select: { userId: true },
    });
    if (candidates.length !== candidateIds.length) throw new BadRequestException('One or more candidates are invalid');

    // Ensure voter hasn't submitted a ballot yet
    const ballot = await this.prisma.ballotSubmission.findUnique({ where: { electionId_voterUserId: { electionId, voterUserId } } });
    if (ballot) throw new BadRequestException('You have already submitted your ballot');

    // Transaction: create ballot + votes
    await this.prisma.$transaction(async (tx) => {
      await tx.ballotSubmission.create({ data: { electionId, voterUserId } });
      await tx.vote.createMany({
        data: candidateIds.map((cid) => ({ electionId, voterUserId, candidateUserId: cid })),
        skipDuplicates: false,
      });
    });

    return { ok: true };
  }

  // Return the APC Vidhan Sabha ballot for the current user based on LocalUnit->VidhanSabha
  async myBallot(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    if (!(user.role === 'CWCPresident' || user.role === 'CWCMember')) return { election: null, candidates: [] };
    if (!user.localUnitId) return { election: null, candidates: [] };
    const lu = await this.prisma.localUnit.findUnique({ where: { id: user.localUnitId }, select: { vidhansabhaId: true } });
    if (!lu) return { election: null, candidates: [] };
    const election = await this.prisma.election.findFirst({ where: { councilLevel: 'APC', status: 'Active', vidhansabhaId: lu.vidhansabhaId } });
    if (!election) return { election: null, candidates: [] };
    const candidates = await this.prisma.candidate.findMany({
      where: { electionId: election.id },
      include: { user: { select: { id: true, name: true, phone: true } } },
    });
    return { election, candidates };
  }

  // Create one Vidhan Sabha-wide APC election for a Vidhan Sabha
  async createApcElections(dto: CreateApcElectionsDto) {
    const e = await this.prisma.election.create({ data: { councilLevel: 'APC', position: `APC (Vidhan Sabha)`, status: 'Active', openedAt: new Date(), vidhansabhaId: dto.vidhansabhaId } });

    await this.audit.log({
      actorUserId: dto.actorUserId ?? null,
      action: 'ELECTION_CREATE_APC_VIDHANSABHA',
      entityType: 'Vidhansabha',
      entityId: String(dto.vidhansabhaId),
      reason: dto.reason,
      metadata: { count: 1 },
    });

    return e;
  }

  async results(electionId: number) {
    const election = await this.prisma.election.findUnique({ where: { id: electionId } });
    if (!election) throw new NotFoundException('Election not found');

    const grouped = await this.prisma.vote.groupBy({
      by: ['candidateUserId'],
      where: { electionId },
      _count: { _all: true },
    });

    const withUsers = await Promise.all(
      grouped.map(async (g) => {
        const user = await this.prisma.user.findUnique({ where: { id: g.candidateUserId }, select: { id: true, name: true, phone: true } });
        return { candidateUserId: g.candidateUserId, user, votes: g._count._all };
      })
    );

    withUsers.sort((a, b) => b.votes - a.votes);

    return { election, results: withUsers };
  }
}
