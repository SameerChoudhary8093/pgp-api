import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
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
    listWards(gpId: number): import(".prisma/client").Prisma.PrismaPromise<{
        gpId: number;
        id: number;
        wardNumber: number;
    }[]>;
    listLoksabhas(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    listVidhansabhas(id: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
    }[]>;
    listLocalUnits(id: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
    listWardsLocalUnits(id: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
}
