import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const dbUrl = 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:5432/postgres';
const prisma = new PrismaClient({
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
