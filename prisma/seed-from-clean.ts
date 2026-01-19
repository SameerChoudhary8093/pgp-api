// pgp-api/prisma/seed-from-clean.ts

import { PrismaClient, LocalUnitType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

type CleanUnit = {
  loksabha: string;
  vidhansabha: string;
  name: string;
  type: LocalUnitType;
};

async function main() {
  console.log('🌱 Seeding Clean Data (pgp-api local script)...');

  console.log('Connecting to database via Prisma...');
  await prisma.$connect();
  console.log('✅ Database connection established.');

  const dataPath = path.resolve(__dirname, '../../packages/db/prisma/clean_infrastructure.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error('clean_infrastructure.json not found. Run advanced-clean.ts first.');
  }

  const units: CleanUnit[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const total = units.length;
  console.log(`Found ${total} units to seed from clean_infrastructure.json...`);

  // 1. Seed all unique Loksabhas in bulk
  const uniqueLoksabhas = Array.from(new Set(units.map((u) => u.loksabha)));
  console.log(`Seeding ${uniqueLoksabhas.length} unique Loksabhas with createMany (skipDuplicates)...`);
  await prisma.loksabha.createMany({
    data: uniqueLoksabhas.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const loksabhas = await prisma.loksabha.findMany({
    where: { name: { in: uniqueLoksabhas } },
  });
  const lsMap = new Map<string, number>();
  for (const ls of loksabhas) {
    lsMap.set(ls.name, ls.id);
  }

  // 2. Seed all unique Vidhansabhas in bulk
  const vsDefinitionMap = new Map<string, { name: string; loksabhaId: number }>();
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

  const vsIdMap = new Map<string, number>();
  for (const vs of vidhansabhas) {
    const key = `${vs.loksabhaId}|${vs.name}`;
    vsIdMap.set(key, vs.id);
  }

  // 3. Seed all LocalUnits in bulk
  const localUnitRows: { name: string; type: LocalUnitType; vidhansabhaId: number }[] = [];
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

