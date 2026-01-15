import { PrismaService } from '../prisma.service';
import { JWTPayload } from 'jose';
export declare class SupabaseService {
    private prisma;
    private jwks?;
    private jwksUrl;
    constructor(prisma: PrismaService);
    verifyToken(bearer: string): Promise<JWTPayload>;
    getUserFromPayload(payload: JWTPayload): Promise<any>;
}
