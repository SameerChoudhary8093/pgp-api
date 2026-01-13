import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { AddCandidateDto } from './dto/add-candidate.dto';
import { CloseElectionDto } from './dto/close-election.dto';
import { VoteDto } from './dto/vote.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateApcElectionsDto } from './dto/create-apc-elections.dto';

@Controller()
export class ElectionsController {
  constructor(private readonly elections: ElectionsService) {}

  // Public
  @Get('elections')
  list() {
    return this.elections.list();
  }

  // Place static route before :id route to avoid collisions
  @Get('elections/my-ballot')
  @UseGuards(AuthGuard)
  myBallot(@Req() req: any) {
    const userId = req.user?.id;
    return this.elections.myBallot(userId);
  }

  @Get('elections/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.elections.detail(id);
  }

  @Post('elections/:id/vote')
  @UseGuards(AuthGuard)
  vote(@Param('id', ParseIntPipe) id: number, @Body() dto: VoteDto, @Req() req: any) {
    const voterUserId = req.user?.id;
    return this.elections.vote(id, voterUserId, dto);
  }

  // Admin (MVP: pass actorUserId + reason)
  @Post('admin/elections')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  create(@Body() dto: CreateElectionDto) {
    return this.elections.createElection(dto);
  }

  @Post('admin/elections/:id/candidates')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  addCandidate(@Param('id', ParseIntPipe) id: number, @Body() dto: AddCandidateDto) {
    return this.elections.addCandidate(id, dto);
  }

  @Post('admin/elections/:id/close')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  close(@Param('id', ParseIntPipe) id: number, @Body() dto: CloseElectionDto) {
    return this.elections.closeElection(id, dto);
  }

  // Create 21 APC elections for a district
  @Post('admin/elections/apc')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  createApc(@Body() dto: CreateApcElectionsDto) {
    return this.elections.createApcElections(dto);
  }

  // View election results (admin)
  @Get('admin/elections/:id/results')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  results(@Param('id', ParseIntPipe) id: number) {
    return this.elections.results(id);
  }
}
