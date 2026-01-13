import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  // Districts
  listDistricts() {
    return this.prisma.district.findMany({ orderBy: { name: 'asc' } });
  }

  listGpsByDistrict(districtId: number) {
    return this.prisma.gramPanchayat.findMany({ where: { districtId }, orderBy: { name: 'asc' } });
  }

  listGPs() {
    return this.prisma.gramPanchayat.findMany({ orderBy: { name: 'asc' } });
  }

  listWardsByGp(gpId: number) {
    return this.prisma.ward.findMany({ where: { gpId }, orderBy: { wardNumber: 'asc' } });
  }

  // New hierarchy
  listLoksabhas() {
    return this.prisma.loksabha.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
  }

  listVidhansabhas(loksabhaId: number) {
    return this.prisma.vidhansabha.findMany({ where: { loksabhaId }, orderBy: { name: 'asc' }, select: { id: true, name: true } });
  }

  listLocalUnits(vidhansabhaId: number) {
    return this.prisma.localUnit.findMany({ where: { vidhansabhaId }, orderBy: [{ type: 'asc' }, { name: 'asc' }], select: { id: true, name: true, type: true } });
  }

  listWardsLocalUnits(vidhansabhaId: number) {
    return this.prisma.localUnit.findMany({ where: { vidhansabhaId, type: 'Ward' }, orderBy: { name: 'asc' }, select: { id: true, name: true, type: true } });
  }

}
