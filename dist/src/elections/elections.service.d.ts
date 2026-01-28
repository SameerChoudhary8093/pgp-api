import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';
import { AddCandidateDto } from './dto/add-candidate.dto';
import { CloseElectionDto } from './dto/close-election.dto';
import { CreateElectionDto } from './dto/create-election.dto';
import { VoteDto } from './dto/vote.dto';
import { CreateApcElectionsDto } from './dto/create-apc-elections.dto';
export declare class ElectionsService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    createElection(dto: CreateElectionDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vidhansabhaId: number | null;
        districtId: number | null;
        status: import(".prisma/client").$Enums.ElectionStatus;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    addCandidate(electionId: number, dto: AddCandidateDto): Promise<{
        id: number;
        userId: number;
        electionId: number;
    }>;
    closeElection(electionId: number, dto: CloseElectionDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vidhansabhaId: number | null;
        districtId: number | null;
        status: import(".prisma/client").$Enums.ElectionStatus;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    list(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vidhansabhaId: number | null;
        districtId: number | null;
        status: import(".prisma/client").$Enums.ElectionStatus;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        openedAt: Date | null;
        closedAt: Date | null;
    }[]>;
    detail(electionId: number): Promise<{
        election: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            vidhansabhaId: number | null;
            districtId: number | null;
            status: import(".prisma/client").$Enums.ElectionStatus;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            openedAt: Date | null;
            closedAt: Date | null;
        };
        candidates: {
            id: number;
            user: {
                id: number;
                name: string;
                phone: string;
            };
            votes: number;
        }[];
    }>;
    vote(electionId: number, voterUserId: number, dto: VoteDto): Promise<{
        ok: boolean;
    }>;
    myBallot(userId: number): Promise<{
        election: null;
        candidates: never[];
    } | {
        election: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            vidhansabhaId: number | null;
            districtId: number | null;
            status: import(".prisma/client").$Enums.ElectionStatus;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            openedAt: Date | null;
            closedAt: Date | null;
        };
        candidates: ({
            user: {
                id: number;
                name: string;
                phone: string;
            };
        } & {
            id: number;
            userId: number;
            electionId: number;
        })[];
    }>;
    createApcElections(dto: CreateApcElectionsDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vidhansabhaId: number | null;
        districtId: number | null;
        status: import(".prisma/client").$Enums.ElectionStatus;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    results(electionId: number): Promise<{
        election: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            vidhansabhaId: number | null;
            districtId: number | null;
            status: import(".prisma/client").$Enums.ElectionStatus;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            openedAt: Date | null;
            closedAt: Date | null;
        };
        results: {
            candidateUserId: number;
            user: {
                id: number;
                name: string;
                phone: string;
            } | null;
            votes: number;
        }[];
    }>;
}
