import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AuditService } from '../audit/audit.service';
import { AdminUsersController } from './admin-users.controller';
import { PromotionService } from './promotion.service';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UsersController, AdminUsersController],
  providers: [UsersService, PrismaService, AuditService, PromotionService],
  exports: [UsersService],
})
export class UsersModule {}
