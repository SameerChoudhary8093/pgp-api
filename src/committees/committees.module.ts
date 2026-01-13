import { Module } from '@nestjs/common';
import { CommitteesService } from './committees.service';
import { CommitteesController } from './committees.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AuditService } from '../audit/audit.service';

@Module({
  imports: [AuthModule],
  controllers: [CommitteesController],
  providers: [CommitteesService, PrismaService, AuditService],
  exports: [CommitteesService],
})
export class CommitteesModule {}
