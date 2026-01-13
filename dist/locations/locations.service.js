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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let LocationsService = class LocationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listDistricts() {
        return this.prisma.district.findMany({ orderBy: { name: 'asc' } });
    }
    listGpsByDistrict(districtId) {
        return this.prisma.gramPanchayat.findMany({ where: { districtId }, orderBy: { name: 'asc' } });
    }
    listGPs() {
        return this.prisma.gramPanchayat.findMany({ orderBy: { name: 'asc' } });
    }
    listWardsByGp(gpId) {
        return this.prisma.ward.findMany({ where: { gpId }, orderBy: { wardNumber: 'asc' } });
    }
    listLoksabhas() {
        return this.prisma.loksabha.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
    }
    listVidhansabhas(loksabhaId) {
        return this.prisma.vidhansabha.findMany({ where: { loksabhaId }, orderBy: { name: 'asc' }, select: { id: true, name: true } });
    }
    listLocalUnits(vidhansabhaId) {
        return this.prisma.localUnit.findMany({ where: { vidhansabhaId }, orderBy: [{ type: 'asc' }, { name: 'asc' }], select: { id: true, name: true, type: true } });
    }
    listWardsLocalUnits(vidhansabhaId) {
        return this.prisma.localUnit.findMany({ where: { vidhansabhaId, type: 'Ward' }, orderBy: { name: 'asc' }, select: { id: true, name: true, type: true } });
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map