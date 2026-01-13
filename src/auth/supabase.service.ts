import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class SupabaseService {
  private jwks?: ReturnType<typeof createRemoteJWKSet>;
  private jwksUrl: string;

  constructor(private prisma: PrismaService) {
    const url = process.env.SUPABASE_JWKS_URL || '';
    if (!url) {
      // In production this must be set, but allow process to start for now
      // to avoid crashing during local dev before configuration.
      // eslint-disable-next-line no-console
      console.warn('SUPABASE_JWKS_URL is not set. AuthGuard will reject tokens.');
    }
    this.jwksUrl = url;
    if (url) this.jwks = createRemoteJWKSet(new URL(url));
  }

  async verifyToken(bearer: string): Promise<JWTPayload> {
    if (!this.jwks) throw new UnauthorizedException('Auth not configured');
    const { payload } = await jwtVerify(bearer, this.jwks, {
      // issuer and audience are optional; adjust if you enforce them
      // issuer: process.env.SUPABASE_ISSUER,
      // audience: process.env.SUPABASE_AUDIENCE,
    });
    return payload;
  }

  async getUserFromPayload(payload: JWTPayload) {
    const sub = payload.sub;
    if (!sub) return null;
    // Cast to any to avoid TS mismatch until Prisma Client is regenerated after migration
    const user = await (this.prisma as any).user.findFirst({ where: { authUserId: sub } });
    return user;
  }
}
