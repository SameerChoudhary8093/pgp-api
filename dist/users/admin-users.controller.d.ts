import { UsersService } from './users.service';
export declare class AdminUsersController {
    private readonly users;
    constructor(users: UsersService);
    promoteToPpc(id: number, body: {
        actorUserId: number;
        reason: string;
    }): Promise<{
        name: string;
        phone: string;
        id: number;
        memberId: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
    promoteToSsp(id: number, body: {
        actorUserId: number;
        reason: string;
    }): Promise<{
        name: string;
        phone: string;
        id: number;
        memberId: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
