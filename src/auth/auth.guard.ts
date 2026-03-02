import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from './supabase.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private supabase: SupabaseService,
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request & { user?: any; auth?: any }>();
        const authHeader = (req.headers['authorization'] as string) || '';

        // Dev mode bypass
        if (process.env.AUTH_DEV_MODE === 'true') {
            try {
                const devHeader = (req.headers['x-dev-user-id'] as string) || '';
                let devUserId: number | null = null;
                if (authHeader?.startsWith('Dev ')) {
                    const val = authHeader.slice(4).trim();
                    const parsed = parseInt(val, 10);
                    if (!Number.isNaN(parsed)) devUserId = parsed;
                }
                if (!devUserId && devHeader) {
                    const parsed = parseInt(devHeader, 10);
                    if (!Number.isNaN(parsed)) devUserId = parsed;
                }
                if (devUserId) {
                    const user = await (this.prisma as any).user.findUnique({ where: { id: devUserId } });
                    if (!user) throw new UnauthorizedException('Dev user not found');
                    (req as any).auth = { dev: true, userId: devUserId };
                    (req as any).user = user;
                    return true;
                }

                // Handle dev-token format for PIN resets
                if (authHeader.startsWith('Bearer dev-token:')) {
                    const phone = authHeader.slice('Bearer dev-token:'.length).trim();
                    const cleanPhone = phone.replace(/[^0-9]/g, '');
                    const searchPhone = cleanPhone.slice(-10);
                    const standardFormat = `+91${searchPhone}`;
                    const user = await (this.prisma as any).user.findFirst({
                        where: {
                            OR: [
                                { phone: phone },
                                { phone: searchPhone },
                                { phone: `0${searchPhone}` },
                                { phone: standardFormat },
                            ],
                        },
                    });
                    if (!user) throw new UnauthorizedException('User not found for dev-token');
                    (req as any).auth = { dev: true, phone };
                    (req as any).user = user;
                    return true;
                }
            } catch (error) {
                console.error('AuthGuard Dev mode validation failed:', error);
            }
        }

        const auth = req.headers['authorization'] || '';
        const token = Array.isArray(auth) ? auth[0] : auth;
        if (!token?.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');

        const bearer = token.slice('Bearer '.length);
        let payload;
        let user;

        // 1. Try Custom JWT
        try {
            payload = this.jwtService.verify(bearer);
            if (payload && payload.id) {
                user = await (this.prisma as any).user.findUnique({ where: { id: payload.id } });
            }
        } catch (e) { }

        // 2. Try Supabase
        if (!user) {
            try {
                payload = await this.supabase.verifyToken(bearer);
                user = await this.supabase.getUserFromPayload(payload);
            } catch (error: any) {
                throw new UnauthorizedException('Authentication failed');
            }
        }

        if (!user) throw new UnauthorizedException('User not found');

        (req as any).auth = payload;
        (req as any).user = user;
        return true;
    }
}
