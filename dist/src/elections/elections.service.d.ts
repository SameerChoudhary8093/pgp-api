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
        createdAt: Date;
        updatedAt: Date;
        id: number;
        vidhansabhaId: number | null;
        status: import(".prisma/client").$Enums.ElectionStatus;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        districtId: number | null;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    addCandidate(electionId: number, dto: AddCandidateDto): Promise<{
        id: number;
        userId: number;
        electionId: number;
    }>;
    closeElection(electionId: number, dto: CloseElectionDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        vidhansabhaId: number | null;
        status: import(".prisma/client").$Enums.ElectionStatus;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        districtId: number | null;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    list(): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        vidhansabhaId: number | null;
        status: import(".prisma/client").$Enums.ElectionStatus;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        districtId: number | null;
        openedAt: Date | null;
        closedAt: Date | null;
    }[]>;
    detail(electionId: number): Promise<{
        election: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            vidhansabhaId: number | null;
            status: import(".prisma/client").$Enums.ElectionStatus;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            districtId: number | null;
            openedAt: Date | null;
            closedAt: Date | null;
        };
        candidates: {
            id: number;
            user: {
                name: string;
                phone: string;
                id: number;
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
            createdAt: Date;
            updatedAt: Date;
            id: number;
            vidhansabhaId: number | null;
            status: import(".prisma/client").$Enums.ElectionStatus;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            districtId: number | null;
            openedAt: Date | null;
            closedAt: Date | null;
        };
        candidates: ({
            user: {
                name: string;
                phone: string;
                id: number;
            };
        } & {
            id: number;
            userId: number;
            electionId: number;
        })[];
    }>;
    createApcElections(dto: CreateApcElectionsDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        vidhansabhaId: number | null;
        status: import(".prisma/client").$Enums.ElectionStatus;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        districtId: number | null;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    results(electionId: number): Promise<{
        election: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            vidhansabhaId: number | null;
            status: import(".prisma/client").$Enums.ElectionStatus;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            districtId: number | null;
            openedAt: Date | null;
            closedAt: Date | null;
        };
        results: {
            candidateUserId: number;
            user: {
                name: string;
                phone: string;
                id: number;
            } | null;
            votes: number;
        }[];
    }>;
}
