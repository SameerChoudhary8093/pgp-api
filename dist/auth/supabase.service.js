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
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const jose_1 = require("jose");
let SupabaseService = class SupabaseService {
    prisma;
    jwks;
    jwksUrl;
    constructor(prisma) {
        this.prisma = prisma;
        const url = process.env.SUPABASE_JWKS_URL || '';
        if (!url) {
            console.warn('SUPABASE_JWKS_URL is not set. AuthGuard will reject tokens.');
        }
        this.jwksUrl = url;
        if (url)
            this.jwks = (0, jose_1.createRemoteJWKSet)(new URL(url));
    }
    async verifyToken(bearer) {
        if (!this.jwks)
            throw new common_1.UnauthorizedException('Auth not configured');
        const { payload } = await (0, jose_1.jwtVerify)(bearer, this.jwks, {});
        return payload;
    }
    async getUserFromPayload(payload) {
        const sub = payload.sub;
        if (!sub)
            return null;
        const user = await this.prisma.user.findFirst({ where: { authUserId: sub } });
        return user;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map