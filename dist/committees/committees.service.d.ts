import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';
export declare class CommitteesService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    createCommittee(name: string, localUnitId: number, type: string, actorUserId: number, reason?: string): Promise<{
        name: string;
        localUnitId: number;
        id: number;
        type: import(".prisma/client").$Enums.CommitteeType;
    }>;
    addMember(committeeId: number, userId: number, role: string, makePresident: boolean, actorUserId: number, reason?: string): Promise<{
        ok: boolean;
    }>;
    myTeam(presidentUserId: number): Promise<{
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
