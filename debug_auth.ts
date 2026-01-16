import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const dbUrl = 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:5432/postgres';
const prisma = new PrismaClient({
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
        } else {
            console.log(`  -> Hash starts with: ${user.passwordHash.substring(0, 10)}...`);
            // Test common passwords
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
                // Also try checking against a locally generated hash of the same password to ensure bcrypt compat
                const testHash = await bcrypt.hash('test', 10);
                const testMatch = await bcrypt.compare('test', testHash);
                if (!testMatch) {
                    console.log('  -> WARNING: Local bcrypt hash/compare test FAILED. Library issue?');
                } else {
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
