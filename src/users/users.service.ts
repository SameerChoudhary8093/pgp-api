import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'bcryptjs';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuditService } from '../audit/audit.service';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

function randomReferralCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private prisma: PrismaService, private audit: AuditService) { }

  async register(dto: RegisterDto) {
    // Ensure phone is unique
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) throw new BadRequestException('Phone already registered');

    // Validate location
    if (!dto.localUnitId) throw new BadRequestException('Please select a Local Unit');
    const lu = await this.prisma.localUnit.findUnique({ where: { id: dto.localUnitId } });
    if (!lu) throw new BadRequestException('Invalid local unit');
    const localUnitId = lu.id;

    // Resolve referrer
    let referredByUserId: number | null = null;
    if (dto.referralCode) {
      const ref = await this.prisma.user.findUnique({ where: { referralCode: dto.referralCode } });
      if (!ref) throw new BadRequestException('Invalid referral code');
      referredByUserId = ref.id;
    }

    // Generate unique referral code
    let referralCode = randomReferralCode();
    for (let i = 0; i < 5; i++) {
      const clash = await this.prisma.user.findUnique({ where: { referralCode } });
      if (!clash) break;
      referralCode = randomReferralCode();
    }
    // One last check
    const finalClash = await this.prisma.user.findUnique({ where: { referralCode } });
    if (finalClash) throw new BadRequestException('Please retry: referral code generation conflict');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Generate unique memberId: PGP-######
    async function generateMemberId(): Promise<string> {
      for (let i = 0; i < 10; i++) {
        const n = Math.floor(Math.random() * 999999) + 1;
        const candidate = `PGP-${String(n).padStart(6, '0')}`;
        const clash = await this.prisma.user.findUnique({ where: { memberId: candidate } });
        if (!clash) return candidate;
      }
      // Fallback to timestamp-based unique
      return `PGP-${String(Date.now()).slice(-6)}`;
    }
    const memberId = await generateMemberId.call(this);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        wardId: dto.wardId ?? undefined,
        localUnitId: localUnitId ?? undefined,
        referralCode,
        referredByUserId: referredByUserId ?? undefined,
        passwordHash,
        authUserId: dto.authUserId ?? undefined,
        memberId,
      },
      select: { id: true, name: true, phone: true, referralCode: true, referredByUserId: true, memberId: true },
    });

    return user;
  }

  async login(phone: string, plain: string) {
    if (!phone || !plain) throw new BadRequestException('Phone and password required');
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      this.logger.warn(`Login failed: User not found for phone '${phone}'`);
      throw new BadRequestException('Invalid credentials - User not found');
    }

    // Check password
    if (user.passwordHash) {
      const match = await bcrypt.compare(plain, user.passwordHash);
      if (!match) {
        this.logger.warn(`Login failed: Password mismatch for user ${user.id} (${user.phone})`);
        throw new BadRequestException('Invalid credentials - Password mismatch');
      }
    } else {
      this.logger.warn(`Login failed: User ${user.id} has no password hash`);
      // If no password hash (legacy user?), fail
      throw new BadRequestException('Invalid credentials - No password set for this user');
    }

    return { id: user.id, name: user.name };
  }

  async recruits(userId: number, take = 50) {
    const recruits = await this.prisma.user.findMany({
      where: { referredByUserId: userId },
      orderBy: { id: 'desc' },
      take,
      select: { id: true, name: true, phone: true, createdAt: true, photoUrl: true },
    });
    const total = await this.prisma.user.count({ where: { referredByUserId: userId } });
    return { total, recruits };
  }

  async recruitmentProgress(userId: number) {
    const [total, user] = await Promise.all([
      this.prisma.user.count({ where: { referredByUserId: userId } }),
      this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
    ]);
    const role = user?.role ?? 'Member';

    let target = 0;
    // "Senior Members target 5 workers"
    if (['CWCPresident', 'CWCMember', 'ExtendedMember'].includes(role)) {
      target = 5;
    }
    // "Workers/Members Target 21 members" (updated from 20)
    else {
      target = 21;
    }

    const remaining = Math.max(target - total, 0);
    return { role, total, target, remaining };
  }

  async summary(userId: number) {
    if (!userId || Number.isNaN(userId)) {
      throw new BadRequestException('Invalid user id for summary');
    }

    // Some environments have an incomplete DB (missing Ward/LocalUnit/etc tables).
    // Prisma will throw P2021 for missing tables if we select relations.
    // To keep the dashboard unblocked, fetch scalar fields first, then best-effort relations.
    const baseUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        referralCode: true,
        memberId: true,
        photoUrl: true,
        wardId: true,
        localUnitId: true,
      },
    });

    if (!baseUser) throw new BadRequestException('User not found');

    let ward: any = null;
    if (baseUser.wardId) {
      try {
        ward = await this.prisma.ward.findUnique({
          where: { id: baseUser.wardId },
          select: { id: true, wardNumber: true, gp: { select: { id: true, name: true } } },
        });
      } catch {
        ward = null;
      }
    }

    let localUnit: any = null;
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
      } catch {
        localUnit = null;
      }
    }

    const user = {
      id: baseUser.id,
      name: baseUser.name,
      phone: baseUser.phone,
      role: baseUser.role,
      referralCode: baseUser.referralCode,
      memberId: baseUser.memberId,
      photoUrl: baseUser.photoUrl,
      ward,
      localUnit,
    };

    const recruitsCount = await this.prisma.user.count({ where: { referredByUserId: userId } });

    // votesCast is non‑critical for the dashboard; if the Vote model/table is not
    // present or any error occurs here, just default to 0 instead of throwing 500.
    let votesCast = 0;
    try {
      const prismaAny = this.prisma as any;
      if (prismaAny.vote && typeof prismaAny.vote.count === 'function') {
        votesCast = await prismaAny.vote.count({ where: { voterUserId: userId } });
      }
    } catch {
      votesCast = 0;
    }

    return { user, recruitsCount, votesCast };
  }

  async leaderboard(take = 20) {
    // Top referrers by recruit count
    const grouped = await this.prisma.user.groupBy({
      by: ['referredByUserId'],
      where: { referredByUserId: { not: null } },
      _count: { _all: true },
    });
    grouped.sort((a, b) => ((b._count?._all ?? 0) - (a._count?._all ?? 0)));
    const top = grouped.slice(0, take);
    const entries = await Promise.all(
      top.map(async (g) => {
        const u = g.referredByUserId
          ? await this.prisma.user.findUnique({ where: { id: g.referredByUserId }, select: { id: true, name: true, phone: true } })
          : null;
        return { user: u, recruits: g._count?._all ?? 0 };
      })
    );
    return entries.filter((e) => e.user);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    // Only allow updating photoUrl for now
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        photoUrl: dto.photoUrl ?? undefined,
      },
      select: { id: true, name: true, memberId: true, photoUrl: true, role: true },
    });
    return updated;
  }

  async uploadProfilePhoto(userId: number, file: any) {
    if (!file) throw new BadRequestException('No file provided');
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.mimetype)) throw new BadRequestException('Only JPG/PNG are allowed');
    if (file.size > 2 * 1024 * 1024) throw new BadRequestException('Max file size is 2MB');

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    // --- Local Storage Fallback if Supabase not configured ---
    if (!serviceKey) {
      // Fallback to local storage
      const uploadDir = path.join(process.cwd(), 'uploads', 'users');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = file.mimetype.includes('png') ? 'png' : 'jpg';
      const filename = `${userId}-${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, file.buffer);

      // Assuming API is running on localhost:3002 or whatever configured
      // We can use a relative URL if on same domain, or absolute.
      // The static assets are served at /uploads/
      // Let's assume absolute for safety if frontend is on different port
      const port = process.env.PORT || 3002;
      // We can just construct a path that the frontend can use if it proxies, 
      // but typically full URL is better for DB storage.
      // However, we don't know the public hostname easily.
      // Let's use a protocol-relative or just /api if we have reverse proxy? No.
      // Let's hardcode localhost for dev fallback.
      const publicUrl = `http://localhost:${port}/uploads/users/${filename}`;

      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: { photoUrl: publicUrl },
        select: { id: true, photoUrl: true },
      });
      return { photoUrl: updated.photoUrl };
    }

    const jwksUrl = process.env.SUPABASE_JWKS_URL || '';
    const url = new URL(jwksUrl || '');
    if (!url.origin) throw new InternalServerErrorException('Supabase base URL not configured');
    const supabaseBase = `${url.protocol}//${url.host}`; // https://<project>.supabase.co
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
      throw new InternalServerErrorException(`Upload failed: ${errText}`);
    }

    const publicUrl = `${supabaseBase}/storage/v1/object/public/${encodeURIComponent(bucket)}/${objectPath}`;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { photoUrl: publicUrl },
      select: { id: true, photoUrl: true },
    });
    return { photoUrl: updated.photoUrl };
  }

  async adminSearchUsers(q: string, take = 20) {
    const where: any = q
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

  async adminUpdateRole(userId: number, newRole: string, actorUserId: number, reason: string) {
    if (!reason) throw new BadRequestException('Reason is required');
    const updated = await this.prisma.user.update({ where: { id: userId }, data: { role: newRole as any }, select: { id: true, name: true, phone: true, role: true, memberId: true } });
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

  async adminPromoteToRole(userId: number, target: 'PPC' | 'SSP', actorUserId: number, reason: string) {
    if (!reason) throw new BadRequestException('Reason is required');
    const targetRole = target === 'PPC' ? 'PPC' : 'SSP';
    const updated = await this.prisma.user.update({ where: { id: userId }, data: { role: targetRole as any }, select: { id: true, name: true, phone: true, role: true, memberId: true } });
    await this.audit.log({
      actorUserId,
      action: `ADMIN_PROMOTE_TO_${target}`,
      entityType: 'User',
      entityId: String(userId),
      reason,
    });
    return updated;
  }
}
