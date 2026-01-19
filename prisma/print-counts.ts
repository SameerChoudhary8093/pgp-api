// pgp-api/prisma/print-counts.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ls = await prisma.loksabha.count();
  const vs = await prisma.vidhansabha.count();
  const lu = await prisma.localUnit.count();

  console.log(`Loksabha count: ${ls}`);
  console.log(`Vidhansabha count: ${vs}`);
  console.log(`LocalUnit count: ${lu}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
