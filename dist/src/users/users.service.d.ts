import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuditService } from '../audit/audit.service';
export declare class UsersService {
    private prisma;
    private audit;
    private readonly logger;
    constructor(prisma: PrismaService, audit: AuditService);
    register(dto: RegisterDto): Promise<{
        id: number;
        name: string;
        phone: string;
        referralCode: string;
        referredByUserId: number | null;
        memberId: string | null;
    }>;
    login(phone: string, plain: string): Promise<{
        id: number;
        name: string;
    }>;
    recruits(userId: number, take?: number): Promise<{
        total: number;
        recruits: {
            id: number;
            name: string;
            phone: string;
            createdAt: Date;
            photoUrl: string | null;
        }[];
    }>;
    recruitmentProgress(userId: number): Promise<{
        role: string;
        total: number;
        target: number;
        remaining: number;
    }>;
    summary(userId: number): Promise<{
        user: {
            id: number;
            name: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
            referralCode: string;
            memberId: string | null;
            photoUrl: string | null;
            ward: any;
            localUnit: any;
        };
        recruitsCount: number;
        votesCast: number;
    }>;
    leaderboard(take?: number): Promise<{
        user: {
            id: number;
            name: string;
            phone: string;
        } | null;
        recruits: number;
    }[]>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        id: number;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        photoUrl: string | null;
    }>;
    uploadProfilePhoto(userId: number, file: any): Promise<{
        photoUrl: string | null;
    }>;
    adminSearchUsers(q: string, take?: number): Promise<{
        id: number;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
    }[]>;
    adminUpdateRole(userId: number, newRole: string, actorUserId: number, reason: string): Promise<{
        id: number;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
    }>;
    adminPromoteToRole(userId: number, target: 'PPC' | 'SSP', actorUserId: number, reason: string): Promise<{
        id: number;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
    }>;
}
