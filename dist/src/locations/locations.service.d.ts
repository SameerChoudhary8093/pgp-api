import { PrismaService } from '../prisma.service';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    listDistricts(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    listGpsByDistrict(districtId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        districtId: number;
    }[]>;
    listGPs(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        districtId: number;
    }[]>;
    listWardsByGp(gpId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        wardNumber: number;
        gpId: number;
    }[]>;
    listLoksabhas(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    listVidhansabhas(loksabhaId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    listLocalUnits(vidhansabhaId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
    listWardsLocalUnits(vidhansabhaId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
}
