const { Client } = require('pg');
const connectionString = 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:5432/postgres';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();
        console.log('Successfully connected to the database');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error:', err.stack);
        process.exit(1);
    }
}

run();
