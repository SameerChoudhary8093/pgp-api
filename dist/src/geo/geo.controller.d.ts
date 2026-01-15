import { GeoService } from './geo.service';
export declare class GeoController {
    private readonly geo;
    constructor(geo: GeoService);
    loksabhas(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    vidhansabhas(id: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    localUnits(id: number, type?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
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
