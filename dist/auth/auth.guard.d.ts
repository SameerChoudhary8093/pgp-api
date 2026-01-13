import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { PrismaService } from '../prisma.service';
export declare class AuthGuard implements CanActivate {
    private supabase;
    private prisma;
    constructor(supabase: SupabaseService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
