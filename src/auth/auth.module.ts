import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { SupabaseService } from './supabase.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [PrismaService, SupabaseService, AuthGuard, RolesGuard],
  exports: [SupabaseService, AuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
