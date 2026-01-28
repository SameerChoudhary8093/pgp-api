"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const user = await prisma.user.findFirst();
    if (user) {
        console.log(`Name: ${user.name}`);
        console.log(`Phone: ${user.phone}`);
    }
    else {
        console.log('No user found');
    }
    await prisma.$disconnect();
}
main();
//# sourceMappingURL=check_user.js.map