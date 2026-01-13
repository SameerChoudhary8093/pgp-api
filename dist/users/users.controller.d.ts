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
        id: number;
        memberId: string | null;
        referredByUserId: number | null;
    }>;
    login(dto: any): Promise<{
        id: number;
        name: string;
    }>;
    meSummary(req: any): Promise<{
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
    updateMe(req: any, dto: UpdateProfileDto): Promise<{
        name: string;
        photoUrl: string | null;
        id: number;
        memberId: string | null;
        role: import(".prisma/client").$Enums.Role;
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
            photoUrl: string | null;
            createdAt: Date;
            id: number;
        }[];
    }>;
    summary(id: number): Promise<{
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
        id: number;
        memberId: string | null;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    adminUpdateRole(id: number, dto: UpdateRoleDto): Promise<{
        name: string;
        phone: string;
        id: number;
        memberId: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
