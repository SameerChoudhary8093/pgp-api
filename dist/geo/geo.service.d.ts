import { PrismaService } from '../prisma.service';
export declare class GeoService {
    private prisma;
    constructor(prisma: PrismaService);
    loksabhas(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    vidhansabhas(loksabhaId: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    localUnits(vidhansabhaId: number, type?: string): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
    qaCounts(): Promise<{
        loksabhas: number;
        vidhansabhas: number;
        localUnits: number;
        byType: {
            Ward: number;
            GramPanchayat: number;
        };
    }>;
}
