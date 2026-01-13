import { CommitteesService } from './committees.service';
export declare class CommitteesController {
    private readonly committees;
    constructor(committees: CommitteesService);
    createCommittee(body: {
        name: string;
        localUnitId: number;
        type: string;
        actorUserId: number;
        reason?: string;
    }): Promise<{
        name: string;
        localUnitId: number;
        id: number;
        type: import(".prisma/client").$Enums.CommitteeType;
    }>;
    addMember(id: number, body: {
        userId: number;
        role: string;
        isPresident?: boolean;
        actorUserId: number;
        reason?: string;
    }): Promise<{
        ok: boolean;
    }>;
    myTeam(req: any): Promise<{
        committee: null;
        members: never[];
    } | {
        committee: {
            id: number;
            name: string;
        };
        members: ({
            user: {
                name: string;
                phone: string;
                id: number;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            createdAt: Date;
            role: import(".prisma/client").$Enums.Role | null;
            userId: number;
            committeeId: number;
            isPresident: boolean;
        })[];
    }>;
}
