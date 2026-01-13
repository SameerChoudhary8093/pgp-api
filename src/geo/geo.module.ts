import { Module } from '@nestjs/common';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GeoController],
  providers: [GeoService, PrismaService],
})
export class GeoModule {}
