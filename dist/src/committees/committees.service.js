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
exports.CommitteesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const audit_service_1 = require("../audit/audit.service");
let CommitteesService = class CommitteesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async createCommittee(name, localUnitId, type, actorUserId, reason) {
        const lu = await this.prisma.localUnit.findUnique({ where: { id: localUnitId } });
        if (!lu)
            throw new common_1.BadRequestException('Invalid localUnitId');
        const committee = await this.prisma.committee.create({ data: { name, localUnitId, type: type } });
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
    async addMember(committeeId, userId, role, makePresident, actorUserId, reason) {
        const committee = await this.prisma.committee.findUnique({ where: { id: committeeId } });
        if (!committee)
            throw new common_1.NotFoundException('Committee not found');
        if (makePresident && role !== 'CWCPresident')
            role = 'CWCPresident';
        const data = {
            userId,
            committeeId,
            role,
            isPresident: makePresident,
        };
        if (makePresident) {
            await this.prisma.committeeMember.updateMany({ where: { committeeId, isPresident: true }, data: { isPresident: false } });
        }
        await this.prisma.committeeMember.upsert({
            where: { userId_committeeId: { userId, committeeId } },
            update: data,
            create: data,
        });
        const userRole = makePresident ? 'CWCPresident' : role;
        await this.prisma.user.update({ where: { id: userId }, data: { role: userRole } });
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
    async myTeam(presidentUserId) {
        const pres = await this.prisma.committeeMember.findFirst({
            where: { userId: presidentUserId, isPresident: true },
            include: { committee: true },
        });
        if (!pres)
            return { committee: null, members: [] };
        const members = await this.prisma.committeeMember.findMany({
            where: { committeeId: pres.committeeId, role: { in: ['CWCMember', 'ExtendedMember'] } },
            include: { user: { select: { id: true, name: true, phone: true, role: true } } },
            orderBy: { userId: 'asc' },
        });
        return { committee: { id: pres.committee.id, name: pres.committee.name }, members };
    }
};
exports.CommitteesService = CommitteesService;
exports.CommitteesService = CommitteesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], CommitteesService);
//# sourceMappingURL=committees.service.js.map