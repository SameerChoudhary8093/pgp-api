"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dbUrl = 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:5432/postgres';
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
});
async function main() {
    console.log('--- Debug Auth Script ---');
    const users = await prisma.user.findMany({
        take: 10,
        select: { id: true, name: true, phone: true, pin: true, role: true }
    });
    console.log(`Found ${users.length} users.`);
    for (const user of users) {
        console.log(`User ID: ${user.id}, Name: ${user.name}, Phone: ${user.phone}, Role: ${user.role}`);
        if (!user.pin) {
            console.log('  -> No PIN set.');
        }
        else {
            console.log(`  -> PIN hash starts with: ${user.pin.substring(0, 10)}...`);
        }
    }
    await prisma.$disconnect();
}
main().catch(e => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=debug_auth.js.map