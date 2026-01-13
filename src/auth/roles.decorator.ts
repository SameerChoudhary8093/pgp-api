import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type RoleType = 'Admin' | 'SeniorMember' | 'Worker' | 'ChiefWorker' | 'Member' | 'CWCPresident' | 'ALCPresident' | 'SLCPresident';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
