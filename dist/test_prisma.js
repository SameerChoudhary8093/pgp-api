"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:5432/postgres'
        }
    }
});
async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users:', users);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test_prisma.js.map