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
exports.ElectionsController = void 0;
const common_1 = require("@nestjs/common");
const elections_service_1 = require("./elections.service");
const create_election_dto_1 = require("./dto/create-election.dto");
const add_candidate_dto_1 = require("./dto/add-candidate.dto");
const close_election_dto_1 = require("./dto/close-election.dto");
const vote_dto_1 = require("./dto/vote.dto");
const auth_guard_1 = require("../auth/auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const create_apc_elections_dto_1 = require("./dto/create-apc-elections.dto");
let ElectionsController = class ElectionsController {
    elections;
    constructor(elections) {
        this.elections = elections;
    }
    list() {
        return this.elections.list();
    }
    myBallot(req) {
        const userId = req.user?.id;
        return this.elections.myBallot(userId);
    }
    detail(id) {
        return this.elections.detail(id);
    }
    vote(id, dto, req) {
        const voterUserId = req.user?.id;
        return this.elections.vote(id, voterUserId, dto);
    }
    create(dto) {
        return this.elections.createElection(dto);
    }
    addCandidate(id, dto) {
        return this.elections.addCandidate(id, dto);
    }
    close(id, dto) {
        return this.elections.closeElection(id, dto);
    }
    createApc(dto) {
        return this.elections.createApcElections(dto);
    }
    results(id) {
        return this.elections.results(id);
    }
};
exports.ElectionsController = ElectionsController;
__decorate([
    (0, common_1.Get)('elections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('elections/my-ballot'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "myBallot", null);
__decorate([
    (0, common_1.Get)('elections/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)('elections/:id/vote'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, vote_dto_1.VoteDto, Object]),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "vote", null);
__decorate([
    (0, common_1.Post)('admin/elections'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_election_dto_1.CreateElectionDto]),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('admin/elections/:id/candidates'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, add_candidate_dto_1.AddCandidateDto]),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "addCandidate", null);
__decorate([
    (0, common_1.Post)('admin/elections/:id/close'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, close_election_dto_1.CloseElectionDto]),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "close", null);
__decorate([
    (0, common_1.Post)('admin/elections/apc'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_apc_elections_dto_1.CreateApcElectionsDto]),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "createApc", null);
__decorate([
    (0, common_1.Get)('admin/elections/:id/results'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ElectionsController.prototype, "results", null);
exports.ElectionsController = ElectionsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [elections_service_1.ElectionsService])
], ElectionsController);
//# sourceMappingURL=elections.controller.js.map