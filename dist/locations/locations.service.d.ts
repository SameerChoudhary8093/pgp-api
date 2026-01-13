import { PrismaService } from '../prisma.service';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    listDistricts(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        nameHi: string | null;
        state: string | null;
    }[]>;
    listGpsByDistrict(districtId: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        districtId: number;
    }[]>;
    listGPs(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        districtId: number;
    }[]>;
    listWardsByGp(gpId: number): import(".prisma/client").Prisma.PrismaPromise<{
        gpId: number;
        id: number;
        wardNumber: number;
    }[]>;
    listLoksabhas(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    listVidhansabhas(loksabhaId: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    listLocalUnits(vidhansabhaId: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
    listWardsLocalUnits(vidhansabhaId: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
}
