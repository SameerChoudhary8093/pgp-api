import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from './supabase.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: any; auth?: any }>();
    // Dev mode bypass for local testing: use Authorization: Dev <userId> or x-dev-user-id header
    // Dev mode bypass for local testing: use Authorization: Dev <userId> or x-dev-user-id header
    if (process.env.AUTH_DEV_MODE === 'true') {
      try {
        const authHeader = (req.headers['authorization'] as string) || '';
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
      } catch (error) {
        console.error('AuthGuard Dev mode validation failed:', error);
        // Fallthrough to regular auth or throw
        // If we found a dev header but failed DB, likely DB issue. 
        // Failing safely to allow standard auth check (which might also fail if DB down)
        // prevents immediate 500, but unauthorized is better than 500.
      }
    }

    const auth = req.headers['authorization'] || '';
    const token = Array.isArray(auth) ? auth[0] : auth;
    if (!token?.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');

    const bearer = token.slice('Bearer '.length);
    let payload;
    let user;
    try {
      payload = await this.supabase.verifyToken(bearer);
      user = await this.supabase.getUserFromPayload(payload);
    } catch (error: any) {
      console.error('AuthGuard verification failed:', error.message);
      throw new UnauthorizedException('Authentication failed');
    }

    if (!user) throw new UnauthorizedException('User not found');

    (req as any).auth = payload;
    (req as any).user = user;
    return true;
  }
}
