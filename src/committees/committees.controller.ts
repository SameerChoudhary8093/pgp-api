import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CommitteesService } from './committees.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller()
export class CommitteesController {
  constructor(private readonly committees: CommitteesService) {}

  // Admin: create committee
  @Post('admin/committees')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  createCommittee(
    @Body() body: { name: string; localUnitId: number; type: string; actorUserId: number; reason?: string },
  ) {
    return this.committees.createCommittee(body.name, body.localUnitId, body.type, body.actorUserId, body.reason);
  }

  // Admin: add member or set president
  @Post('admin/committees/:id/members')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  addMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: number; role: string; isPresident?: boolean; actorUserId: number; reason?: string },
  ) {
    return this.committees.addMember(id, body.userId, body.role, !!body.isPresident, body.actorUserId, body.reason);
  }

  // CWC President: view my team
  @Get('cwc/my-team')
  @UseGuards(AuthGuard)
  myTeam(@Req() req: any) {
    const userId = req.user?.id;
    return this.committees.myTeam(userId);
  }
}
