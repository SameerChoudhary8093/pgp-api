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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
const prisma_service_1 = require("../prisma.service");
let AuthGuard = class AuthGuard {
    supabase;
    prisma;
    constructor(supabase, prisma) {
        this.supabase = supabase;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        if (process.env.AUTH_DEV_MODE === 'true') {
            const authHeader = req.headers['authorization'] || '';
            const devHeader = req.headers['x-dev-user-id'] || '';
            let devUserId = null;
            if (authHeader?.startsWith('Dev ')) {
                const val = authHeader.slice(4).trim();
                const parsed = parseInt(val, 10);
                if (!Number.isNaN(parsed))
                    devUserId = parsed;
            }
            if (!devUserId && devHeader) {
                const parsed = parseInt(devHeader, 10);
                if (!Number.isNaN(parsed))
                    devUserId = parsed;
            }
            if (devUserId) {
                const user = await this.prisma.user.findUnique({ where: { id: devUserId } });
                if (!user)
                    throw new common_1.UnauthorizedException('Dev user not found');
                req.auth = { dev: true, userId: devUserId };
                req.user = user;
                return true;
            }
        }
        const auth = req.headers['authorization'] || '';
        const token = Array.isArray(auth) ? auth[0] : auth;
        if (!token?.startsWith('Bearer '))
            throw new common_1.UnauthorizedException('Missing bearer token');
        const bearer = token.slice('Bearer '.length);
        const payload = await this.supabase.verifyToken(bearer);
        const user = await this.supabase.getUserFromPayload(payload);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        req.auth = payload;
        req.user = user;
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService, prisma_service_1.PrismaService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map