import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthGuard implements CanActivate {
    private supabase;
    private prisma;
    private jwtService;
    constructor(supabase: SupabaseService, prisma: PrismaService, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
