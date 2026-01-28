import { UsersService } from './users.service';
export declare class AdminUsersController {
    private readonly users;
    constructor(users: UsersService);
    promoteToPpc(id: number, body: {
        actorUserId: number;
        reason: string;
    }): Promise<{
        id: number;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
    }>;
    promoteToSsp(id: number, body: {
        actorUserId: number;
        reason: string;
    }): Promise<{
        id: number;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
    }>;
}
