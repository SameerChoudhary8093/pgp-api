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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const locations_service_1 = require("./locations.service");
let LocationsController = class LocationsController {
    locationsService;
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    listDistricts() {
        return this.locationsService.listDistricts();
    }
    listGpsByDistrict(districtId) {
        return this.locationsService.listGpsByDistrict(districtId);
    }
    listGPs() {
        return this.locationsService.listGPs();
    }
    listWards(gpId) {
        return this.locationsService.listWardsByGp(gpId);
    }
    listLoksabhas() {
        return this.locationsService.listLoksabhas();
    }
    listVidhansabhas(id) {
        return this.locationsService.listVidhansabhas(id);
    }
    listLocalUnits(id) {
        return this.locationsService.listLocalUnits(id);
    }
    listWardsLocalUnits(id) {
        return this.locationsService.listWardsLocalUnits(id);
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)('districts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "listDistricts", null);
__decorate([
    (0, common_1.Get)('districts/:districtId/gps'),
    __param(0, (0, common_1.Param)('districtId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "listGpsByDistrict", null);
__decorate([
    (0, common_1.Get)('gps'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "listGPs", null);
__decorate([
    (0, common_1.Get)('gps/:gpId/wards'),
    __param(0, (0, common_1.Param)('gpId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "listWards", null);
__decorate([
    (0, common_1.Get)('loksabhas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "listLoksabhas", null);
__decorate([
    (0, common_1.Get)('loksabhas/:id/vidhansabhas'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "listVidhansabhas", null);
__decorate([
    (0, common_1.Get)('vidhansabhas/:id/local-units'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "listLocalUnits", null);
__decorate([
    (0, common_1.Get)('vidhansabhas/:id/wards'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "listWardsLocalUnits", null);
exports.LocationsController = LocationsController = __decorate([
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map