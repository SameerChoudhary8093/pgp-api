
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking database connection...');
    try {
        const count = await prisma.loksabha.count();
        console.log(`Loksabha count: ${count}`);

        const users = await prisma.user.count();
        console.log(`User count: ${users}`);

        const all = await prisma.loksabha.findMany();
        console.log('Loksabhas:', JSON.stringify(all));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
