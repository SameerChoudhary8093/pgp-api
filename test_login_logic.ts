import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin(phone: string, plain: string) {
    console.log(`Testing login for ${phone}...`);
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
        console.log('User not found');
        return;
    }
    console.log('User found, checking password...');
    if (user.passwordHash) {
        const match = await bcrypt.compare(plain, user.passwordHash);
        console.log(`Password match: ${match}`);
    } else {
        console.log('No password hash found for user');
    }
}

async function main() {
    // Test with the user we found: Arastu Sharma, Phone: 09001001999
    // We don't know the password, but we can at least see if bcrypt crashes
    await testLogin('09001001999', 'wrong-password');
    await prisma.$disconnect();
}

main();
