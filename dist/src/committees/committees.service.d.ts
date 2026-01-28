import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';
export declare class CommitteesService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    createCommittee(name: string, localUnitId: number, type: string, actorUserId: number, reason?: string): Promise<{
        id: number;
        name: string;
        localUnitId: number;
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
