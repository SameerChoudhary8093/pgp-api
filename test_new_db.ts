import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres:pgp%40123jaipur@db.acbdzgrcvsrqbaocjlpn.supabase.co:5432/postgres'
        }
    }
});

async function main() {
    try {
        console.log('Attempting to connect to the NEW database...');
        // Just try to connect, even if tables aren't there yet
        await prisma.$connect();
        console.log('Successfully connected to the NEW database!');
    } catch (e) {
        console.error('Connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
