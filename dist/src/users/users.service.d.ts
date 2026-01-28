import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuditService } from '../audit/audit.service';
import { PromotionService } from './promotion.service';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private prisma;
    private audit;
    private promotion;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, audit: AuditService, promotion: PromotionService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        name: string;
        phone: string;
        memberId: string | null;
        referralCode: string | null;
        id: number;
        referredByUserId: number | null;
    }>;
    login(phone: string, plain: string): Promise<void>;
    loginWithPin(phone: string, pin: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    recruits(userId: number, take?: number): Promise<{
        total: number;
        recruits: {
            name: string;
            phone: string;
            photoUrl: string | null;
            createdAt: Date;
            id: number;
        }[];
    }>;
    recruitmentProgress(userId: number): Promise<{
        role: string;
        total: number;
        target: number;
        remaining: number;
        nextMilestone: string;
    } | {
        role: string;
        total: number;
        target: number;
        remaining: number;
        nextMilestone?: undefined;
    }>;
    summary(userId: number): Promise<{
        user: null;
        recruitsCount: number;
        votesCast: number;
    } | {
        user: {
            id: any;
            name: any;
            phone: any;
            role: any;
            referralCode: any;
            memberId: any;
            photoUrl: any;
            localUnit: any;
            cwcName: string | null;
        };
        recruitsCount: number;
        votesCast: number;
    }>;
    leaderboard(take?: number): Promise<{
        user: {
            name: string;
            phone: string;
            id: number;
        } | null;
        recruits: number;
    }[]>;
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        name: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        photoUrl: string | null;
        id: number;
    }>;
    uploadProfilePhoto(userId: number, file: any): Promise<{
        photoUrl: string | null;
    }>;
    removeProfilePhoto(userId: number): Promise<{
        photoUrl: null;
    }>;
    adminSearchUsers(q: string, take?: number): Promise<{
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        id: number;
    }[]>;
    adminUpdateRole(userId: number, newRole: string, actorUserId: number, reason: string): Promise<{
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        id: number;
    }>;
    adminPromoteToRole(userId: number, target: 'PPC' | 'SSP', actorUserId: number, reason: string): Promise<{
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        id: number;
    }>;
}
