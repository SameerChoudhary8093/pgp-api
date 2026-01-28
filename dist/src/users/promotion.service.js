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
var PromotionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PromotionService = PromotionService_1 = class PromotionService {
    prisma;
    logger = new common_1.Logger(PromotionService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAndPromote(referrerUserId) {
        const referrer = await this.prisma.user.findUnique({
            where: { id: referrerUserId },
            include: {
                recruits: {
                    where: { committeeMemberships: { none: {} } },
                    include: { localUnit: true },
                    orderBy: { id: 'asc' },
                },
                localUnit: true,
                committeeMemberships: true,
            },
        });
        if (!referrer || !referrer.localUnit)
            return;
        const localRecruits = referrer.recruits.filter((r) => r.localUnitId === referrer.localUnitId);
        this.logger.log(`User ${referrer.id} (${referrer.name}) has ${localRecruits.length} valid local recruits in unit ${referrer.localUnitId}.`);
        if (localRecruits.length < 5)
            return;
        await this.promoteToPresident(referrer, localRecruits.slice(0, 5));
    }
    async promoteToPresident(president, coreTeam) {
        const count = await this.prisma.committee.count({
            where: { localUnitId: president.localUnitId, type: 'CWC' },
        });
        const nextSeq = count + 1;
        const committeeName = `CWC ${president.localUnit.name} ${nextSeq}`;
        await this.prisma.$transaction(async (tx) => {
            if (president.committeeMemberships?.length > 0) {
                await tx.committeeMember.deleteMany({
                    where: { userId: president.id },
                });
            }
            const committee = await tx.committee.create({
                data: {
                    name: committeeName,
                    sequenceNumber: nextSeq,
                    localUnitId: president.localUnitId,
                    type: 'CWC',
                },
            });
            await tx.user.update({
                where: { id: president.id },
                data: { role: 'CWCPresident' },
            });
            await tx.committeeMember.create({
                data: {
                    userId: president.id,
                    committeeId: committee.id,
                    role: 'CWCPresident',
                    isPresident: true,
                },
            });
            for (const member of coreTeam) {
                await tx.user.update({
                    where: { id: member.id },
                    data: { role: 'CWCMember' },
                });
                await tx.committeeMember.create({
                    data: {
                        userId: member.id,
                        committeeId: committee.id,
                        role: 'CWCMember',
                        isPresident: false,
                    },
                });
            }
        });
        this.logger.log(`🎉 NEW CELL FORMED: ${committeeName} led by ${president.name}`);
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = PromotionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionService);
//# sourceMappingURL=promotion.service.js.map