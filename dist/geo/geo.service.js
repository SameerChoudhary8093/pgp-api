"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let GeoService = class GeoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    loksabhas() {
        return this.prisma.loksabha.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
    }
    vidhansabhas(loksabhaId) {
        return this.prisma.vidhansabha.findMany({ where: { loksabhaId }, orderBy: { name: 'asc' }, select: { id: true, name: true } });
    }
    localUnits(vidhansabhaId, type) {
        let where = { vidhansabhaId };
        if (type) {
            const t = type.toLowerCase();
            if (t === 'ward')
                where.type = 'Ward';
            else if (t === 'gram panchayat')
                where.type = 'GramPanchayat';
            else
                throw new common_1.BadRequestException('Invalid type. Use "Ward" or "Gram Panchayat"');
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
};
exports.GeoService = GeoService;
exports.GeoService = GeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeoService);
//# sourceMappingURL=geo.service.js.map