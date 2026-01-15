import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:5432/postgres'
        }
    }
});

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users:', users);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
