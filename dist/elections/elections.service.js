"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const audit_service_1 = require("../audit/audit.service");
let ElectionsService = class ElectionsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async createElection(dto) {
        const election = await this.prisma.election.create({
            data: {
                councilLevel: dto.councilLevel,
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
    async addCandidate(electionId, dto) {
        const election = await this.prisma.election.findUnique({ where: { id: electionId } });
        if (!election)
            throw new common_1.NotFoundException('Election not found');
        if (String(election.status) !== 'Active')
            throw new common_1.BadRequestException('Election is not active');
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (String(election.councilLevel) === 'APC') {
            if (!(user.role === 'CWCPresident' || user.role === 'CWCMember')) {
                throw new common_1.BadRequestException('Only CWC President/Member can be candidates for APC');
            }
            if (!election.vidhansabhaId)
                throw new common_1.BadRequestException('Election is missing Vidhan Sabha');
            if (!user.localUnitId)
                throw new common_1.BadRequestException('Candidate must have a Local Unit');
            const lu = await this.prisma.localUnit.findUnique({ where: { id: user.localUnitId }, select: { vidhansabhaId: true } });
            if (!lu)
                throw new common_1.BadRequestException('Candidate local unit not found');
            if (lu.vidhansabhaId !== election.vidhansabhaId)
                throw new common_1.BadRequestException('Candidate must belong to the Vidhan Sabha');
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
        }
        catch (err) {
            if (String(err?.message || '').includes('Unique constraint failed')) {
                throw new common_1.BadRequestException('User is already a candidate in this election');
            }
            throw err;
        }
    }
    async closeElection(electionId, dto) {
        const election = await this.prisma.election.findUnique({ where: { id: electionId } });
        if (!election)
            throw new common_1.NotFoundException('Election not found');
        if (String(election.status) !== 'Active')
            throw new common_1.BadRequestException('Election already closed');
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
        if (String(election.councilLevel) === 'APC') {
            const grouped = await this.prisma.vote.groupBy({
                by: ['candidateUserId'],
                where: { electionId },
                _count: { _all: true },
            });
            const withCounts = await Promise.all(grouped.map(async (g) => ({
                candidateUserId: g.candidateUserId,
                votes: g._count._all,
            })));
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
    async detail(electionId) {
        const election = await this.prisma.election.findUnique({ where: { id: electionId } });
        if (!election)
            throw new common_1.NotFoundException('Election not found');
        const candidates = await this.prisma.candidate.findMany({
            where: { electionId },
            include: { user: { select: { id: true, name: true, phone: true } } },
        });
        const grouped = await this.prisma.vote.groupBy({
            by: ['candidateUserId'],
            where: { electionId },
            _count: { _all: true },
        });
        const voteCountMap = new Map();
        grouped.forEach((g) => voteCountMap.set(g.candidateUserId, g._count._all));
        const withCounts = candidates.map((c) => ({
            id: c.id,
            user: c.user,
            votes: voteCountMap.get(c.userId) || 0,
        }));
        return { election, candidates: withCounts };
    }
    async vote(electionId, voterUserId, dto) {
        const election = await this.prisma.election.findUnique({ where: { id: electionId } });
        if (!election)
            throw new common_1.NotFoundException('Election not found');
        if (String(election.status) !== 'Active')
            throw new common_1.BadRequestException('Election is not active');
        if (String(election.councilLevel) === 'APC') {
            const voter = await this.prisma.user.findUnique({ where: { id: voterUserId } });
            if (!voter)
                throw new common_1.BadRequestException('Voter not found');
            if (!(voter.role === 'CWCPresident' || voter.role === 'CWCMember')) {
                throw new common_1.BadRequestException('Only CWC President/Member can vote in APC');
            }
            if (!election.vidhansabhaId)
                throw new common_1.BadRequestException('Election is missing Vidhan Sabha');
            if (!voter.localUnitId)
                throw new common_1.BadRequestException('Voter local unit not set');
            const lu = await this.prisma.localUnit.findUnique({ where: { id: voter.localUnitId }, select: { vidhansabhaId: true } });
            if (!lu)
                throw new common_1.BadRequestException('Voter local unit not found');
            if (lu.vidhansabhaId !== election.vidhansabhaId)
                throw new common_1.BadRequestException('Voter not assigned to this Vidhan Sabha');
        }
        const candidateIds = Array.from(new Set(dto.candidateUserIds || []));
        if (candidateIds.length === 0 || candidateIds.length > 21)
            throw new common_1.BadRequestException('Select between 1 and 21 candidates');
        const candidates = await this.prisma.candidate.findMany({
            where: { electionId, userId: { in: candidateIds } },
            select: { userId: true },
        });
        if (candidates.length !== candidateIds.length)
            throw new common_1.BadRequestException('One or more candidates are invalid');
        const ballot = await this.prisma.ballotSubmission.findUnique({ where: { electionId_voterUserId: { electionId, voterUserId } } });
        if (ballot)
            throw new common_1.BadRequestException('You have already submitted your ballot');
        await this.prisma.$transaction(async (tx) => {
            await tx.ballotSubmission.create({ data: { electionId, voterUserId } });
            await tx.vote.createMany({
                data: candidateIds.map((cid) => ({ electionId, voterUserId, candidateUserId: cid })),
                skipDuplicates: false,
            });
        });
        return { ok: true };
    }
    async myBallot(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        if (!(user.role === 'CWCPresident' || user.role === 'CWCMember'))
            return { election: null, candidates: [] };
        if (!user.localUnitId)
            return { election: null, candidates: [] };
        const lu = await this.prisma.localUnit.findUnique({ where: { id: user.localUnitId }, select: { vidhansabhaId: true } });
        if (!lu)
            return { election: null, candidates: [] };
        const election = await this.prisma.election.findFirst({ where: { councilLevel: 'APC', status: 'Active', vidhansabhaId: lu.vidhansabhaId } });
        if (!election)
            return { election: null, candidates: [] };
        const candidates = await this.prisma.candidate.findMany({
            where: { electionId: election.id },
            include: { user: { select: { id: true, name: true, phone: true } } },
        });
        return { election, candidates };
    }
    async createApcElections(dto) {
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
    async results(electionId) {
        const election = await this.prisma.election.findUnique({ where: { id: electionId } });
        if (!election)
            throw new common_1.NotFoundException('Election not found');
        const grouped = await this.prisma.vote.groupBy({
            by: ['candidateUserId'],
            where: { electionId },
            _count: { _all: true },
        });
        const withUsers = await Promise.all(grouped.map(async (g) => {
            const user = await this.prisma.user.findUnique({ where: { id: g.candidateUserId }, select: { id: true, name: true, phone: true } });
            return { candidateUserId: g.candidateUserId, user, votes: g._count._all };
        }));
        withUsers.sort((a, b) => b.votes - a.votes);
        return { election, results: withUsers };
    }
};
exports.ElectionsService = ElectionsService;
exports.ElectionsService = ElectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], ElectionsService);
//# sourceMappingURL=elections.service.js.map