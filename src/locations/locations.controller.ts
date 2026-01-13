import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
// Zone management removed

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('districts')
  listDistricts() {
    return this.locationsService.listDistricts();
  }

  @Get('districts/:districtId/gps')
  listGpsByDistrict(@Param('districtId', ParseIntPipe) districtId: number) {
    return this.locationsService.listGpsByDistrict(districtId);
  }

  @Get('gps')
  listGPs() {
    return this.locationsService.listGPs();
  }

  @Get('gps/:gpId/wards')
  listWards(@Param('gpId', ParseIntPipe) gpId: number) {
    return this.locationsService.listWardsByGp(gpId);
  }

  // New hierarchy
  @Get('loksabhas')
  listLoksabhas() {
    return this.locationsService.listLoksabhas();
  }

  @Get('loksabhas/:id/vidhansabhas')
  listVidhansabhas(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.listVidhansabhas(id);
  }

  @Get('vidhansabhas/:id/local-units')
  listLocalUnits(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.listLocalUnits(id);
  }

  @Get('vidhansabhas/:id/wards')
  listWardsLocalUnits(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.listWardsLocalUnits(id);
  }
}
