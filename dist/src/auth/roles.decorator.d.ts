export declare const ROLES_KEY = "roles";
export type RoleType = 'Admin' | 'SeniorMember' | 'Worker' | 'ChiefWorker' | 'Member' | 'CWCPresident' | 'ALCPresident' | 'SLCPresident';
export declare const Roles: (...roles: RoleType[]) => import("@nestjs/common").CustomDecorator<string>;
