import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
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
    listWards(gpId: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        gpId: number;
        wardNumber: number;
    }[]>;
    listLoksabhas(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    listVidhansabhas(id: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    listLocalUnits(id: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
    listWardsLocalUnits(id: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        type: import(".prisma/client").$Enums.LocalUnitType;
    }[]>;
}
