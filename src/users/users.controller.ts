import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards, Patch, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any) {
    console.log('Login attempt for:', dto.phone);
    try {
      const result = await this.usersService.login(dto.phone, dto.password);
      console.log('Login successful for:', dto.phone);
      return result;
    } catch (error: any) {
      console.error('Login error details:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal Server Error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Authenticated: current user's summary
  @Get('me/summary')
  @UseGuards(AuthGuard)
  meSummary(@Req() req: any) {
    const userId = req?.user?.id;
    return this.usersService.summary(userId);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const userId = req?.user?.id;
    return this.usersService.updateProfile(userId, dto);
  }

  // Authenticated: recruitment progress for current user (target 20)
  @Get('me/recruitment-progress')
  @UseGuards(AuthGuard)
  myRecruitmentProgress(@Req() req: any) {
    const userId = req?.user?.id;
    return this.usersService.recruitmentProgress(userId);
  }

  // Authenticated: upload profile photo via service role to Supabase Storage
  @Post('me/photo')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  uploadMyPhoto(@Req() req: any, @UploadedFile() file: any) {
    const userId = req?.user?.id;
    return this.usersService.uploadProfilePhoto(userId, file);
  }

  @Delete('me/photo')
  @UseGuards(AuthGuard)
  deleteMyPhoto(@Req() req: any) {
    const userId = req?.user?.id;
    return this.usersService.removeProfilePhoto(userId);
  }

  @Get('me/recruits')
  @UseGuards(AuthGuard)
  myRecruits(@Req() req: any, @Query('take') take?: string) {
    const userId = req?.user?.id;
    const limit = Math.min(Math.max(parseInt(take || '50', 10) || 50, 1), 200);
    return this.usersService.recruits(userId, limit);
  }

  @Get(':id/recruits')
  recruits(
    @Param('id', ParseIntPipe) id: number,
    @Query('take') take?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(take || '50', 10) || 50, 1), 200);
    return this.usersService.recruits(id, limit);
  }

  @Get(':id/summary')
  summary(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.summary(id);
  }

  @Get(':id/recruitment-progress')
  recruitmentProgress(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.recruitmentProgress(id);
  }

  @Get('leaderboard')
  leaderboard(@Query('take') take?: string) {
    const limit = Math.min(Math.max(parseInt(take || '20', 10) || 20, 1), 100);
    return this.usersService.leaderboard(limit);
  }

  // Admin: search users
  @Get('admin/users/search')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  adminSearch(@Query('q') q = '', @Query('take') take?: string) {
    const limit = Math.min(Math.max(parseInt(take || '20', 10) || 20, 1), 200);
    return this.usersService.adminSearchUsers(q, limit);
  }

  // Admin: update user role (with mandatory reason)
  @Post('admin/users/:id/role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  adminUpdateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.usersService.adminUpdateRole(id, dto.role, dto.actorUserId, dto.reason);
  }

}
