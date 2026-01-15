import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const user = await prisma.user.findFirst();
    if (user) {
        console.log(`Name: ${user.name}`);
        console.log(`Phone: ${user.phone}`);
    } else {
        console.log('No user found');
    }
    await prisma.$disconnect();
}
main();
