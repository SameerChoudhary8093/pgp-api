
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const phone = '8107165371';
    const password = 'rahul@pgp';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalized phone format
    const normalizedPhone = `+91${phone}`;

    console.log(`Checking for user ${phone}...`);

    const existing = await prisma.user.findFirst({
        where: {
            OR: [
                { phone: phone },
                { phone: normalizedPhone }
            ]
        }
    });

    if (existing) {
        console.log(`User found (ID: ${existing.id}). Updating password...`);
        await prisma.user.update({
            where: { id: existing.id },
            data: { passwordHash: hashedPassword }
        });
        console.log('Password updated successfully.');
    } else {
        console.log('User not found. Creating new user...');

        // Create Location Chain
        let localUnit = await prisma.localUnit.findFirst();

        if (!localUnit) {
            console.log('Creating dummy Local Unit...');
            // Correct fields based on Schema: Loksabha only has 'name'
            const loksabha = await prisma.loksabha.create({
                data: { name: 'Dummy Loksabha' }
            });
            const vidhansabha = await prisma.vidhansabha.create({
                data: { name: 'Dummy Vidhansabha', loksabhaId: loksabha.id }
            });
            localUnit = await prisma.localUnit.create({
                data: { name: 'Dummy Ward', type: 'Ward', vidhansabhaId: vidhansabha.id }
            });
        }

        const newUser = await prisma.user.create({
            data: {
                name: 'Rahul PGP',
                phone: normalizedPhone,
                passwordHash: hashedPassword,
                memberId: 'PGP-TEST-001',
                localUnitId: localUnit.id,
                address: 'Test Address',
                referralCode: 'TESTCODE'
            }
        });
        console.log(`User created successfully! (ID: ${newUser.id})`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
