"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        const count = await prisma.auditLog.count();
        console.log(`Audit logs count: ${count}`);
    }
    catch (e) {
        console.log('AuditLog table is MISSING');
    }
    await prisma.$disconnect();
}
main();
//# sourceMappingURL=check_audit.js.map