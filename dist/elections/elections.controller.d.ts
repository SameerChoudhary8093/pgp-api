import { ElectionsService } from './elections.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { AddCandidateDto } from './dto/add-candidate.dto';
import { CloseElectionDto } from './dto/close-election.dto';
import { VoteDto } from './dto/vote.dto';
import { CreateApcElectionsDto } from './dto/create-apc-elections.dto';
export declare class ElectionsController {
    private readonly elections;
    constructor(elections: ElectionsService);
    list(): Promise<{
        createdAt: Date;
        id: number;
        updatedAt: Date;
        vidhansabhaId: number | null;
        districtId: number | null;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        status: import(".prisma/client").$Enums.ElectionStatus;
        openedAt: Date | null;
        closedAt: Date | null;
    }[]>;
    myBallot(req: any): Promise<{
        election: null;
        candidates: never[];
    } | {
        election: {
            createdAt: Date;
            id: number;
            updatedAt: Date;
            vidhansabhaId: number | null;
            districtId: number | null;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            status: import(".prisma/client").$Enums.ElectionStatus;
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
    detail(id: number): Promise<{
        election: {
            createdAt: Date;
            id: number;
            updatedAt: Date;
            vidhansabhaId: number | null;
            districtId: number | null;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            status: import(".prisma/client").$Enums.ElectionStatus;
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
    vote(id: number, dto: VoteDto, req: any): Promise<{
        ok: boolean;
    }>;
    create(dto: CreateElectionDto): Promise<{
        createdAt: Date;
        id: number;
        updatedAt: Date;
        vidhansabhaId: number | null;
        districtId: number | null;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        status: import(".prisma/client").$Enums.ElectionStatus;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    addCandidate(id: number, dto: AddCandidateDto): Promise<{
        id: number;
        userId: number;
        electionId: number;
    }>;
    close(id: number, dto: CloseElectionDto): Promise<{
        createdAt: Date;
        id: number;
        updatedAt: Date;
        vidhansabhaId: number | null;
        districtId: number | null;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        status: import(".prisma/client").$Enums.ElectionStatus;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    createApc(dto: CreateApcElectionsDto): Promise<{
        createdAt: Date;
        id: number;
        updatedAt: Date;
        vidhansabhaId: number | null;
        districtId: number | null;
        councilLevel: import(".prisma/client").$Enums.CouncilLevel;
        position: string;
        status: import(".prisma/client").$Enums.ElectionStatus;
        openedAt: Date | null;
        closedAt: Date | null;
    }>;
    results(id: number): Promise<{
        election: {
            createdAt: Date;
            id: number;
            updatedAt: Date;
            vidhansabhaId: number | null;
            districtId: number | null;
            councilLevel: import(".prisma/client").$Enums.CouncilLevel;
            position: string;
            status: import(".prisma/client").$Enums.ElectionStatus;
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
