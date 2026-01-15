import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const count = await prisma.auditLog.count();
        console.log(`Audit logs count: ${count}`);
    } catch (e) {
        console.log('AuditLog table is MISSING');
    }
    await prisma.$disconnect();
}
main();
