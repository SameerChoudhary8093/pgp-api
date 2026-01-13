import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GeoService {
  constructor(private prisma: PrismaService) {}

  loksabhas() {
    return this.prisma.loksabha.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
  }

  vidhansabhas(loksabhaId: number) {
    return this.prisma.vidhansabha.findMany({ where: { loksabhaId }, orderBy: { name: 'asc' }, select: { id: true, name: true } });
  }

  localUnits(vidhansabhaId: number, type?: string) {
    let where: any = { vidhansabhaId };
    if (type) {
      const t = type.toLowerCase();
      if (t === 'ward') where.type = 'Ward';
      else if (t === 'gram panchayat') where.type = 'GramPanchayat';
      else throw new BadRequestException('Invalid type. Use "Ward" or "Gram Panchayat"');
    }
    return this.prisma.localUnit.findMany({ where, orderBy: [{ type: 'asc' }, { name: 'asc' }], select: { id: true, name: true, type: true } });
  }

  async qaCounts() {
    const [loksabhas, vidhansabhas, localUnits, wards, gps] = await Promise.all([
      this.prisma.loksabha.count(),
      this.prisma.vidhansabha.count(),
      this.prisma.localUnit.count(),
      this.prisma.localUnit.count({ where: { type: 'Ward' } }),
      this.prisma.localUnit.count({ where: { type: 'GramPanchayat' } }),
    ]);
    return {
      loksabhas,
      vidhansabhas,
      localUnits,
      byType: { Ward: wards, GramPanchayat: gps },
    };
  }
}
