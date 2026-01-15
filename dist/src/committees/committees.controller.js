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
exports.CommitteesController = void 0;
const common_1 = require("@nestjs/common");
const committees_service_1 = require("./committees.service");
const auth_guard_1 = require("../auth/auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let CommitteesController = class CommitteesController {
    committees;
    constructor(committees) {
        this.committees = committees;
    }
    createCommittee(body) {
        return this.committees.createCommittee(body.name, body.localUnitId, body.type, body.actorUserId, body.reason);
    }
    addMember(id, body) {
        return this.committees.addMember(id, body.userId, body.role, !!body.isPresident, body.actorUserId, body.reason);
    }
    myTeam(req) {
        const userId = req.user?.id;
        return this.committees.myTeam(userId);
    }
};
exports.CommitteesController = CommitteesController;
__decorate([
    (0, common_1.Post)('admin/committees'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommitteesController.prototype, "createCommittee", null);
__decorate([
    (0, common_1.Post)('admin/committees/:id/members'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CommitteesController.prototype, "addMember", null);
__decorate([
    (0, common_1.Get)('cwc/my-team'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommitteesController.prototype, "myTeam", null);
exports.CommitteesController = CommitteesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [committees_service_1.CommitteesService])
], CommitteesController);
//# sourceMappingURL=committees.controller.js.map