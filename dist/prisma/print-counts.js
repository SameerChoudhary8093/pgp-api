"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=print-counts.js.map