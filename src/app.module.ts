import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { ElectionsModule } from './elections/elections.module';
import { AuthModule } from './auth/auth.module';
import { GeoModule } from './geo/geo.module';
import { CommitteesModule } from './committees/committees.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [UsersModule, AuditModule, ElectionsModule, AuthModule, GeoModule, CommitteesModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
