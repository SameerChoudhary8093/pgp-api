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
        id: number;
        name: string;
        localUnitId: number;
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
                id: number;
                name: string;
                phone: string;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            role: import(".prisma/client").$Enums.Role | null;
            createdAt: Date;
            userId: number;
            committeeId: number;
            isPresident: boolean;
        })[];
    }>;
}
