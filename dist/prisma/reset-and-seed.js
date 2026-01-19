"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function resetAndSeed() {
    console.log('⚠️ RESET: Deleting all existing geo data (localUnit, vidhansabha, loksabha)...');
    const beforeLs = await prisma.loksabha.count();
    const beforeVs = await prisma.vidhansabha.count();
    const beforeLu = await prisma.localUnit.count();
    console.log(`Before reset -> Loksabha: ${beforeLs}, Vidhansabha: ${beforeVs}, LocalUnits: ${beforeLu}`);
    await prisma.localUnit.deleteMany();
    await prisma.vidhansabha.deleteMany();
    await prisma.loksabha.deleteMany();
    const afterClearLs = await prisma.loksabha.count();
    const afterClearVs = await prisma.vidhansabha.count();
    const afterClearLu = await prisma.localUnit.count();
    console.log(`After clear  -> Loksabha: ${afterClearLs}, Vidhansabha: ${afterClearVs}, LocalUnits: ${afterClearLu}`);
    console.log('✅ All geo tables cleared. Running seed-production...');
    const afterSeedLs = await prisma.loksabha.count();
    const afterSeedVs = await prisma.vidhansabha.count();
    const afterSeedLu = await prisma.localUnit.count();
    console.log(`After seed   -> Loksabha: ${afterSeedLs}, Vidhansabha: ${afterSeedVs}, LocalUnits: ${afterSeedLu}`);
    console.log('✅ Reset + Seed complete.');
}
resetAndSeed()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=reset-and-seed.js.map