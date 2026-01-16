import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(dto: RegisterDto): Promise<{
        name: string;
        phone: string;
        referralCode: string;
        memberId: string | null;
        id: number;
        referredByUserId: number | null;
    }>;
    login(dto: any): Promise<{
        id: number;
        name: string;
    }>;
    meSummary(req: any): Promise<{
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
            ward: any;
            localUnit: any;
        };
        recruitsCount: number;
        votesCast: number;
    }>;
    updateMe(req: any, dto: UpdateProfileDto): Promise<{
        name: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        photoUrl: string | null;
        id: number;
    }>;
    myRecruitmentProgress(req: any): Promise<{
        role: string;
        total: number;
        target: number;
        remaining: number;
    }>;
    uploadMyPhoto(req: any, file: any): Promise<{
        photoUrl: string | null;
    }>;
    recruits(id: number, take?: string): Promise<{
        total: number;
        recruits: {
            name: string;
            phone: string;
            createdAt: Date;
            photoUrl: string | null;
            id: number;
        }[];
    }>;
    summary(id: number): Promise<{
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
            ward: any;
            localUnit: any;
        };
        recruitsCount: number;
        votesCast: number;
    }>;
    recruitmentProgress(id: number): Promise<{
        role: string;
        total: number;
        target: number;
        remaining: number;
    }>;
    leaderboard(take?: string): Promise<{
        user: {
            name: string;
            phone: string;
            id: number;
        } | null;
        recruits: number;
    }[]>;
    adminSearch(q?: string, take?: string): Promise<{
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        id: number;
    }[]>;
    adminUpdateRole(id: number, dto: UpdateRoleDto): Promise<{
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        id: number;
    }>;
}
