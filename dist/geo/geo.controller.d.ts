import { GeoService } from './geo.service';
export declare class GeoController {
    private readonly geo;
    constructor(geo: GeoService);
    loksabhas(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    vidhansabhas(id: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    localUnits(id: number, type?: string): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
    qa(): Promise<{
        loksabhas: number;
        vidhansabhas: number;
        localUnits: number;
        byType: {
            Ward: number;
            GramPanchayat: number;
        };
    }>;
}
