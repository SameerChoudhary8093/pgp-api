"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function testLogin(phone, plain) {
    console.log(`Testing login for ${phone}...`);
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
        console.log('User not found');
        return;
    }
    console.log('User found, checking password...');
    if (user.passwordHash) {
        const match = await bcryptjs_1.default.compare(plain, user.passwordHash);
        console.log(`Password match: ${match}`);
    }
    else {
        console.log('No password hash found for user');
    }
}
async function main() {
    await testLogin('09001001999', 'wrong-password');
    await prisma.$disconnect();
}
main();
//# sourceMappingURL=test_login_logic.js.map