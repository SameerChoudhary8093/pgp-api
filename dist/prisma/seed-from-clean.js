"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding Clean Data (pgp-api local script)...');
    console.log('Connecting to database via Prisma...');
    await prisma.$connect();
    console.log('✅ Database connection established.');
    const dataPath = path.resolve(__dirname, '../../packages/db/prisma/clean_infrastructure.json');
    if (!fs.existsSync(dataPath)) {
        throw new Error('clean_infrastructure.json not found. Run advanced-clean.ts first.');
    }
    const units = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const total = units.length;
    console.log(`Found ${total} units to seed from clean_infrastructure.json...`);
    const uniqueLoksabhas = Array.from(new Set(units.map((u) => u.loksabha)));
    console.log(`Seeding ${uniqueLoksabhas.length} unique Loksabhas with createMany (skipDuplicates)...`);
    await prisma.loksabha.createMany({
        data: uniqueLoksabhas.map((name) => ({ name })),
        skipDuplicates: true,
    });
    const loksabhas = await prisma.loksabha.findMany({
        where: { name: { in: uniqueLoksabhas } },
    });
    const lsMap = new Map();
    for (const ls of loksabhas) {
        lsMap.set(ls.name, ls.id);
    }
    const vsDefinitionMap = new Map();
    for (const u of units) {
        const lsId = lsMap.get(u.loksabha);
        if (!lsId) {
            throw new Error(`Missing Loksabha id for name ${u.loksabha}`);
        }
        const key = `${lsId}|${u.vidhansabha}`;
        if (!vsDefinitionMap.has(key)) {
            vsDefinitionMap.set(key, {
                name: u.vidhansabha,
                loksabhaId: lsId,
            });
        }
    }
    console.log(`Seeding ${vsDefinitionMap.size} unique Vidhansabhas with createMany (skipDuplicates)...`);
    await prisma.vidhansabha.createMany({
        data: Array.from(vsDefinitionMap.values()),
        skipDuplicates: true,
    });
    const vidhansabhas = await prisma.vidhansabha.findMany({
        where: {
            loksabhaId: { in: Array.from(new Set(Array.from(lsMap.values()))) },
        },
    });
    const vsIdMap = new Map();
    for (const vs of vidhansabhas) {
        const key = `${vs.loksabhaId}|${vs.name}`;
        vsIdMap.set(key, vs.id);
    }
    const localUnitRows = [];
    for (const u of units) {
        const lsId = lsMap.get(u.loksabha);
        if (!lsId) {
            throw new Error(`Missing Loksabha id for name ${u.loksabha}`);
        }
        const vsKey = `${lsId}|${u.vidhansabha}`;
        const vsId = vsIdMap.get(vsKey);
        if (!vsId) {
            throw new Error(`Missing Vidhansabha id for key ${vsKey}`);
        }
        localUnitRows.push({
            name: u.name,
            type: u.type,
            vidhansabhaId: vsId,
        });
    }
    console.log(`Seeding ${localUnitRows.length} LocalUnits with createMany (skipDuplicates) in batches...`);
    const batchSize = 5000;
    console.time('localUnits-seeding');
    for (let i = 0; i < localUnitRows.length; i += batchSize) {
        const slice = localUnitRows.slice(i, i + batchSize);
        await prisma.localUnit.createMany({
            data: slice,
            skipDuplicates: true,
        });
        const done = Math.min(i + batchSize, localUnitRows.length);
        console.log(`  → LocalUnit progress: ${done}/${localUnitRows.length}`);
    }
    console.timeEnd('localUnits-seeding');
    console.log('✅ Seeding complete.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-from-clean.js.map