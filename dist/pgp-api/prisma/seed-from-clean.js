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
const sync_1 = require("csv-parse/sync");
const rajasthan_map_ts_1 = require("/Users/apple/Desktop/Archive/packages/db/prisma/data/rajasthan-map.ts");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🚀 Starting Final Production Seed...');
    const mapPath = path.resolve(__dirname, 'gemini_mapping.json');
    if (!fs.existsSync(mapPath)) {
        throw new Error("❌ gemini_mapping.json not found! Run clean-with-gemini.ts first.");
    }
    const aiMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
    console.log(`📘 Loaded ${Object.keys(aiMap).length} AI translations.`);
    const csvPath = path.resolve(__dirname, 'rajasthan_2026_full.csv');
    const records = (0, sync_1.parse)(fs.readFileSync(csvPath, 'utf-8'), { columns: true });
    console.log(`📂 Loaded ${records.length} raw records.`);
    const unitsToInsert = new Map();
    for (const row of records) {
        const acNum = parseInt(row.ac_number);
        const mapping = rajasthan_map_ts_1.RAJASTHAN_AC_MAP[acNum];
        if (!mapping) {
            continue;
        }
        const rawLookup = row.unit_name
            .replace(/GOVT\.?|SCHOOL|ROOM|NO\.?\s*\d+/gi, '')
            .replace(/[^\w\s\(\)\-]/gi, '')
            .trim();
        let finalName = aiMap[rawLookup] || row.unit_name.trim();
        const acName = mapping.v.trim();
        const suffixRegex1 = new RegExp(`\\s*\\(${acName}\\)$`, 'i');
        finalName = finalName.replace(suffixRegex1, '');
        const suffixRegex2 = new RegExp(`\\s+${acName}$`, 'i');
        finalName = finalName.replace(suffixRegex2, '');
        finalName = finalName.trim().replace(/\s+/g, ' ');
        let type = 'GramPanchayat';
        if (row.unit_type === 'Ward' ||
            finalName.match(/^Ward\s+\d+/i) ||
            finalName.match(/Nagar|Colony|Scheme|Basti|Sector|Road|Market|Gate|Chowk/i)) {
            type = 'Ward';
        }
        const key = `${mapping.v}|${finalName}|${type}`;
        if (!unitsToInsert.has(key)) {
            unitsToInsert.set(key, {
                loksabha: mapping.l,
                vidhansabha: mapping.v,
                name: finalName,
                type
            });
        }
    }
    console.log(`✨ Prepare to insert ${unitsToInsert.size} Unique Local Units...`);
    const lsCache = new Map();
    const vsCache = new Map();
    const uniqueLS = new Set([...unitsToInsert.values()].map(u => u.loksabha));
    for (const lsName of uniqueLS) {
        const ls = await prisma.loksabha.upsert({
            where: { name: lsName },
            update: {},
            create: { name: lsName }
        });
        lsCache.set(lsName, ls.id);
    }
    const uniqueVS = new Set([...unitsToInsert.values()].map(u => `${u.loksabha}|${u.vidhansabha}`));
    for (const vsKey of uniqueVS) {
        const [lsName, vsName] = vsKey.split('|');
        const lsId = lsCache.get(lsName);
        const vs = await prisma.vidhansabha.upsert({
            where: { loksabhaId_name: { loksabhaId: lsId, name: vsName } },
            update: {},
            create: { name: vsName, loksabhaId: lsId }
        });
        vsCache.set(vsKey, vs.id);
    }
    let count = 0;
    for (const unit of unitsToInsert.values()) {
        const vsKey = `${unit.loksabha}|${unit.vidhansabha}`;
        const vsId = vsCache.get(vsKey);
        await prisma.localUnit.upsert({
            where: {
                vidhansabhaId_name_type: {
                    vidhansabhaId: vsId,
                    name: unit.name,
                    type: unit.type
                }
            },
            update: {},
            create: {
                name: unit.name,
                type: unit.type,
                vidhansabhaId: vsId
            }
        });
        count++;
        if (count % 1000 === 0)
            process.stdout.write('.');
    }
    console.log(`\n✅ Successfully seeded ${count} Local Units.`);
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=seed-from-clean.js.map