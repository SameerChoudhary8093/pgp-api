"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const audit_service_1 = require("../audit/audit.service");
const promotion_service_1 = require("./promotion.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jwt_1 = require("@nestjs/jwt");
function randomReferralCode(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < length; i++)
        code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}
let UsersService = UsersService_1 = class UsersService {
    prisma;
    audit;
    promotion;
    jwtService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(prisma, audit, promotion, jwtService) {
        this.prisma = prisma;
        this.audit = audit;
        this.promotion = promotion;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const searchPhone = dto.phone.replace(/[^0-9]/g, '').slice(-10);
        if (searchPhone.length < 10)
            throw new common_1.BadRequestException('Invalid phone number. Must be at least 10 digits.');
        const normalizedPhone = `+91${searchPhone}`;
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { phone: dto.phone },
                    { phone: searchPhone },
                    { phone: `0${searchPhone}` },
                    { phone: normalizedPhone },
                ]
            }
        });
        if (existing)
            throw new common_1.BadRequestException('Phone already registered');
        if (!dto.localUnitId)
            throw new common_1.BadRequestException('Please select a Local Unit');
        const lu = await this.prisma.localUnit.findUnique({ where: { id: dto.localUnitId } });
        if (!lu)
            throw new common_1.BadRequestException('Invalid local unit');
        const localUnitId = lu.id;
        let referredByUserId = null;
        if (dto.referralCode) {
            const ref = await this.prisma.user.findUnique({ where: { referralCode: dto.referralCode } });
            if (!ref)
                throw new common_1.BadRequestException('Invalid referral code');
            referredByUserId = ref.id;
        }
        let referralCode = randomReferralCode();
        for (let i = 0; i < 5; i++) {
            const clash = await this.prisma.user.findUnique({ where: { referralCode } });
            if (!clash)
                break;
            referralCode = randomReferralCode();
        }
        const finalClash = await this.prisma.user.findUnique({ where: { referralCode } });
        if (finalClash)
            throw new common_1.BadRequestException('Please retry: referral code generation conflict');
        const passwordHash = dto.password ? await bcryptjs_1.default.hash(dto.password, 10) : undefined;
        const pinHash = dto.pin ? await bcryptjs_1.default.hash(dto.pin, 10) : undefined;
        async function generateMemberId() {
            for (let i = 0; i < 10; i++) {
                const n = Math.floor(Math.random() * 999999) + 1;
                const candidate = `PGP-${String(n).padStart(6, '0')}`;
                const clash = await this.prisma.user.findUnique({ where: { memberId: candidate } });
                if (!clash)
                    return candidate;
            }
            return `PGP-${String(Date.now()).slice(-6)}`;
        }
        const memberId = await generateMemberId.call(this);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                phone: normalizedPhone,
                address: dto.address,
                localUnitId: localUnitId ?? undefined,
                referralCode,
                referredByUserId: referredByUserId ?? undefined,
                pin: pinHash,
                authUserId: dto.authUserId ?? undefined,
                memberId,
            },
            select: { id: true, name: true, phone: true, referralCode: true, referredByUserId: true, memberId: true },
        });
        if (referredByUserId) {
            this.promotion
                .checkAndPromote(referredByUserId)
                .catch((err) => this.logger.error('checkAndPromote failed', err));
        }
        return user;
    }
    async login(phone, plain) {
        throw new common_1.BadRequestException('Password login is no longer supported. Please use PIN login.');
    }
    async loginWithPin(phone, pin) {
        if (!phone || !pin)
            throw new common_1.BadRequestException('Phone and PIN required');
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 10)
            throw new common_1.BadRequestException('Invalid phone number format');
        const searchPhone = cleanPhone.slice(-10);
        const standardFormat = `+91${searchPhone}`;
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { phone: phone },
                    { phone: searchPhone },
                    { phone: `0${searchPhone}` },
                    { phone: standardFormat },
                    { phone: `+91 ${searchPhone.slice(0, 5)} ${searchPhone.slice(5)}` },
                ],
            },
        });
        if (!user) {
            this.logger.warn(`PIN login failed: User not found for phone '${phone}' (search queries: ${searchPhone})`);
            throw new common_1.BadRequestException('Account not found');
        }
        if (!user.pin) {
            this.logger.warn(`PIN login failed: User ${user.id} has no PIN set`);
            throw new common_1.BadRequestException('PIN not set. Please reset your PIN.');
        }
        const match = await bcryptjs_1.default.compare(pin, user.pin);
        if (!match) {
            this.logger.warn(`PIN login failed: PIN mismatch for user ${user.id} (${user.phone})`);
            throw new common_1.BadRequestException('Incorrect PIN');
        }
        const payload = { sub: user.authUserId, role: user.role, id: user.id };
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        };
    }
    async recruits(userId, take = 50) {
        const recruits = await this.prisma.user.findMany({
            where: { referredByUserId: userId },
            orderBy: { id: 'desc' },
            take,
            select: { id: true, name: true, phone: true, createdAt: true, photoUrl: true },
        });
        const total = await this.prisma.user.count({ where: { referredByUserId: userId } });
        return { total, recruits };
    }
    async recruitmentProgress(userId) {
        try {
            const [totalRecruits, user] = await Promise.all([
                this.prisma.user.count({ where: { referredByUserId: userId } }),
                this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
            ]);
            const role = user?.role ?? 'Member';
            let target = 0;
            let nextMilestone = '';
            if (role === 'Member') {
                target = 5;
                nextMilestone = 'Recruit 5 to become CWC President';
            }
            else if (role === 'CWCPresident') {
                target = 25;
                nextMilestone = 'Complete your Presidential Quota (20 General Members)';
            }
            else if (['CWCMember', 'ExtendedMember'].includes(role)) {
                target = 20;
                nextMilestone = 'Complete your Member Quota';
            }
            else {
                target = 25;
                nextMilestone = 'Maintain Leadership Status';
            }
            const remaining = Math.max(target - totalRecruits, 0);
            return {
                role,
                total: totalRecruits,
                target,
                remaining,
                nextMilestone,
            };
        }
        catch (error) {
            this.logger.error('recruitmentProgress failed', error);
            return { role: 'Member', total: 0, target: 5, remaining: 5 };
        }
    }
    async summary(userId) {
        if (!userId || Number.isNaN(Number(userId))) {
            console.warn(`Summary requested for invalid userId: ${userId}`);
            return { user: null, recruitsCount: 0, votesCast: 0 };
        }
        let baseUser;
        try {
            baseUser = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    role: true,
                    referralCode: true,
                    memberId: true,
                    photoUrl: true,
                    localUnitId: true,
                },
            });
        }
        catch (e) {
            this.logger.error(`Summary: Failed to fetch user ${userId}`, e);
            throw new common_1.BadRequestException('Failed to load user data');
        }
        if (!baseUser)
            throw new common_1.BadRequestException('User not found');
        let localUnit = null;
        if (baseUser.localUnitId) {
            try {
                localUnit = await this.prisma.localUnit.findUnique({
                    where: { id: baseUser.localUnitId },
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        vidhansabha: {
                            select: {
                                id: true,
                                name: true,
                                loksabha: { select: { id: true, name: true } },
                            },
                        },
                    },
                });
            }
            catch {
                localUnit = null;
            }
        }
        const committeeMember = await this.prisma.committeeMember.findFirst({
            where: { userId: userId },
            include: { committee: { select: { name: true } } },
        });
        const user = {
            id: baseUser.id,
            name: baseUser.name,
            phone: baseUser.phone,
            role: baseUser.role,
            referralCode: baseUser.referralCode,
            memberId: baseUser.memberId,
            photoUrl: baseUser.photoUrl,
            localUnit,
            cwcName: committeeMember?.committee?.name ?? null,
        };
        const recruitsCount = await this.prisma.user.count({ where: { referredByUserId: userId } });
        let votesCast = 0;
        try {
            const prismaAny = this.prisma;
            if (prismaAny.vote && typeof prismaAny.vote.count === 'function') {
                votesCast = await prismaAny.vote.count({ where: { voterUserId: userId } });
            }
        }
        catch {
            votesCast = 0;
        }
        return { user, recruitsCount, votesCast };
    }
    async leaderboard(take = 20) {
        const grouped = await this.prisma.user.groupBy({
            by: ['referredByUserId'],
            where: { referredByUserId: { not: null } },
            _count: { _all: true },
        });
        grouped.sort((a, b) => ((b._count?._all ?? 0) - (a._count?._all ?? 0)));
        const top = grouped.slice(0, take);
        const entries = await Promise.all(top.map(async (g) => {
            const u = g.referredByUserId
                ? await this.prisma.user.findUnique({ where: { id: g.referredByUserId }, select: { id: true, name: true, phone: true } })
                : null;
            return { user: u, recruits: g._count?._all ?? 0 };
        }));
        return entries.filter((e) => e.user);
    }
    async updateProfile(userId, dto) {
        const data = {};
        if (dto.photoUrl !== undefined)
            data.photoUrl = dto.photoUrl;
        if (dto.pin) {
            data.pin = await bcryptjs_1.default.hash(dto.pin, 10);
        }
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, name: true, memberId: true, photoUrl: true, role: true },
        });
        return updated;
    }
    async uploadProfilePhoto(userId, file) {
        if (!file)
            throw new common_1.BadRequestException('No file provided');
        const allowed = ['image/jpeg', 'image/png'];
        if (!allowed.includes(file.mimetype))
            throw new common_1.BadRequestException('Only JPG/PNG are allowed');
        if (file.size > 2 * 1024 * 1024)
            throw new common_1.BadRequestException('Max file size is 2MB');
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
        if (!serviceKey) {
            const uploadDir = path.join(process.cwd(), 'uploads', 'users');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const ext = file.mimetype.includes('png') ? 'png' : 'jpg';
            const filename = `${userId}-${Date.now()}.${ext}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, file.buffer);
            const publicUrl = `/uploads/users/${filename}`;
            const updated = await this.prisma.user.update({
                where: { id: userId },
                data: { photoUrl: publicUrl },
                select: { id: true, photoUrl: true },
            });
            return { photoUrl: updated.photoUrl };
        }
        const jwksUrl = process.env.SUPABASE_JWKS_URL || '';
        const url = new URL(jwksUrl || '');
        if (!url.origin)
            throw new common_1.InternalServerErrorException('Supabase base URL not configured');
        const supabaseBase = `${url.protocol}//${url.host}`;
        const bucket = process.env.SUPABASE_PHOTOS_BUCKET || 'profile-photos';
        const ext = file.mimetype.includes('png') ? 'png' : 'jpg';
        const objectPath = `users/${userId}-${Date.now()}.${ext}`;
        const uploadRes = await fetch(`${supabaseBase}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${serviceKey}`,
                'Content-Type': file.mimetype,
                'x-upsert': 'true',
            },
            body: file.buffer,
        });
        if (!uploadRes.ok) {
            const errText = await uploadRes.text();
            throw new common_1.InternalServerErrorException(`Upload failed: ${errText}`);
        }
        const publicUrl = `${supabaseBase}/storage/v1/object/public/${encodeURIComponent(bucket)}/${objectPath}`;
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { photoUrl: publicUrl },
            select: { id: true, photoUrl: true },
        });
        return { photoUrl: updated.photoUrl };
    }
    async removeProfilePhoto(userId) {
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { photoUrl: null },
            select: { id: true, photoUrl: true },
        });
        return { photoUrl: null };
    }
    async adminSearchUsers(q, take = 20) {
        const where = q
            ? {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { phone: { contains: q, mode: 'insensitive' } },
                    { memberId: { contains: q, mode: 'insensitive' } },
                ],
            }
            : {};
        return this.prisma.user.findMany({ where, take, orderBy: { id: 'desc' }, select: { id: true, name: true, phone: true, role: true, memberId: true } });
    }
    async adminUpdateRole(userId, newRole, actorUserId, reason) {
        if (!reason)
            throw new common_1.BadRequestException('Reason is required');
        const updated = await this.prisma.user.update({ where: { id: userId }, data: { role: newRole }, select: { id: true, name: true, phone: true, role: true, memberId: true } });
        await this.audit.log({
            actorUserId,
            action: 'ADMIN_UPDATE_ROLE',
            entityType: 'User',
            entityId: String(userId),
            reason,
            metadata: { newRole },
        });
        return updated;
    }
    async adminPromoteToRole(userId, target, actorUserId, reason) {
        if (!reason)
            throw new common_1.BadRequestException('Reason is required');
        const targetRole = target === 'PPC' ? 'PPC' : 'SSP';
        const updated = await this.prisma.user.update({ where: { id: userId }, data: { role: targetRole }, select: { id: true, name: true, phone: true, role: true, memberId: true } });
        await this.audit.log({
            actorUserId,
            action: `ADMIN_PROMOTE_TO_${target}`,
            entityType: 'User',
            entityId: String(userId),
            reason,
        });
        return updated;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        promotion_service_1.PromotionService,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map