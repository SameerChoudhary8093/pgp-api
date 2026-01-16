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
        select: { id: true, name: true, phone: true, passwordHash: true }
    });
    console.log(`Found ${users.length} users.`);
    for (const user of users) {
        console.log(`User ID: ${user.id}, Name: ${user.name}, Phone: ${user.phone}`);
        if (!user.passwordHash) {
            console.log('  -> No password hash set.');
        }
        else {
            console.log(`  -> Hash starts with: ${user.passwordHash.substring(0, 10)}...`);
            const common = ['password', '123456', '12345678', 'admin', 'secret'];
            let found = false;
            for (const pass of common) {
                if (await bcrypt.compare(pass, user.passwordHash)) {
                    console.log(`  -> MATCH FOUND! Password is: '${pass}'`);
                    found = true;
                    break;
                }
            }
            if (!found) {
                const testHash = await bcrypt.hash('test', 10);
                const testMatch = await bcrypt.compare('test', testHash);
                if (!testMatch) {
                    console.log('  -> WARNING: Local bcrypt hash/compare test FAILED. Library issue?');
                }
                else {
                    console.log('  -> Password is NOT one of the common defaults.');
                }
            }
        }
    }
    await prisma.$disconnect();
}
main().catch(e => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=debug_auth.js.map