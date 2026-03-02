import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { SupabaseService } from './supabase.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { SmsService } from './sms.service';
import { OtpService } from './otp.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    SupabaseService,
    AuthGuard,
    RolesGuard,
    SmsService,
    OtpService
  ],
  exports: [SupabaseService, AuthGuard, RolesGuard, JwtModule, OtpService, SmsService],
})
export class AuthModule { }
