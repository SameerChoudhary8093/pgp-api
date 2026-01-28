
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const phone = '9999999999';
    const password = 'password123';
    const name = 'Test Admin User';

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { phone: phone },
    });

    if (existingUser) {
        console.log(`User with phone ${phone} already exists.`);
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Generate Referral Code
    const referralCode = 'TESTADMIN' + Math.floor(1000 + Math.random() * 9000);

    // Create User
    const user = await prisma.user.create({
        data: {
            name: name,
            phone: phone,
            passwordHash: hash,
            address: 'Jaipur, Rajasthan',
            role: 'Admin', // Ensure this role exists in your Schema Enum
            referralCode: referralCode,
            isActive: true,
        },
    });

    console.log(`Created user: ${user.name} (${user.phone}) - Password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
