import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly users: UsersService) {}

  @Post(':id/promote-to-ppc')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  promoteToPpc(@Param('id', ParseIntPipe) id: number, @Body() body: { actorUserId: number; reason: string }) {
    return this.users.adminPromoteToRole(id, 'PPC', body.actorUserId, body.reason);
  }

  @Post(':id/promote-to-ssp')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  promoteToSsp(@Param('id', ParseIntPipe) id: number, @Body() body: { actorUserId: number; reason: string }) {
    return this.users.adminPromoteToRole(id, 'SSP', body.actorUserId, body.reason);
  }
}
