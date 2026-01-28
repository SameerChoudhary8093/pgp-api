import { PrismaService } from '../prisma.service';
export declare class PromotionService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    checkAndPromote(referrerUserId: number): Promise<void>;
    private promoteToPresident;
}
