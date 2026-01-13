import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SupabaseService } from './supabase.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [PrismaService, SupabaseService, AuthGuard, RolesGuard],
  exports: [SupabaseService, AuthGuard, RolesGuard],
})
export class AuthModule {}
