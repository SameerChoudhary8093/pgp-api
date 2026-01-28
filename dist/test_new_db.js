"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres:pgp%40123jaipur@db.acbdzgrcvsrqbaocjlpn.supabase.co:5432/postgres'
        }
    }
});
async function main() {
    try {
        console.log('Attempting to connect to the NEW database...');
        await prisma.$connect();
        console.log('Successfully connected to the NEW database!');
    }
    catch (e) {
        console.error('Connection failed:', e.message);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test_new_db.js.map