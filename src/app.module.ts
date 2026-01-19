import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma.service';

import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { ElectionsModule } from './elections/elections.module';
import { AuthModule } from './auth/auth.module';
import { GeoModule } from './geo/geo.module';
import { CommitteesModule } from './committees/committees.module';

@Module({
  imports: [
    // Caching (global)
    CacheModule.register({
      isGlobal: true,
      ttl: 600000,
      max: 1000,
    }),

    // Throttling: 10 requests per 60 seconds
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    // Health check dependencies
    TerminusModule,

    // Feature modules
    UsersModule,
    AuditModule,
    ElectionsModule,
    AuthModule,
    GeoModule,
    CommitteesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
