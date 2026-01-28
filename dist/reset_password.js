"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const dbUrl = 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:5432/postgres';
const prisma = new client_1.PrismaClient({
    datasources: { db: { url: dbUrl } },
});
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: npx ts-node reset_password.ts <phone> <new_password>');
        process.exit(1);
    }
    const phone = args[0];
    const newPass = args[1];
    console.log(`Searching for user with phone: ${phone}`);
    const users = await prisma.user.findMany({
        where: { phone: { contains: phone.slice(-10) } }
    });
    if (users.length === 0) {
        console.log(`No user found matching phone ending in ${phone.slice(-10)}`);
        process.exit(1);
    }
    if (users.length > 1) {
        console.log('Found multiple users:', users.map(u => `${u.id}: ${u.phone}`).join(', '));
        console.log('Please be more specific.');
        process.exit(1);
    }
    const user = users[0];
    console.log(`Resetting password for User ID ${user.id} (${user.name}, ${user.phone})...`);
    const hash = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hash }
    });
    console.log('Password reset successfully to:', newPass);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
//# sourceMappingURL=reset_password.js.map