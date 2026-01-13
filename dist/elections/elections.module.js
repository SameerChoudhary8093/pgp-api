"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectionsModule = void 0;
const common_1 = require("@nestjs/common");
const elections_service_1 = require("./elections.service");
const elections_controller_1 = require("./elections.controller");
const prisma_service_1 = require("../prisma.service");
const audit_module_1 = require("../audit/audit.module");
const auth_module_1 = require("../auth/auth.module");
let ElectionsModule = class ElectionsModule {
};
exports.ElectionsModule = ElectionsModule;
exports.ElectionsModule = ElectionsModule = __decorate([
    (0, common_1.Module)({
        imports: [audit_module_1.AuditModule, auth_module_1.AuthModule],
        providers: [elections_service_1.ElectionsService, prisma_service_1.PrismaService],
        controllers: [elections_controller_1.ElectionsController],
    })
], ElectionsModule);
//# sourceMappingURL=elections.module.js.map