import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly geo: GeoService) {}

  @Get('loksabhas')
  loksabhas() {
    return this.geo.loksabhas();
  }

  @Get('loksabhas/:id/vidhansabhas')
  vidhansabhas(@Param('id', ParseIntPipe) id: number) {
    return this.geo.vidhansabhas(id);
    }

  @Get('vidhansabhas/:id/local-units')
  localUnits(@Param('id', ParseIntPipe) id: number, @Query('type') type?: string) {
    return this.geo.localUnits(id, type);
  }

  @Get('qa')
  qa() {
    return this.geo.qaCounts();
  }
}
