const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:6543/postgres',
});
client.connect()
    .then(async () => {
        console.log('ENV DB CONNECT SUCCESS');
        const res = await client.query('SELECT count(*) FROM "Loksabha"');
        console.log('Loksabhas count:', res.rows[0].count);
        client.end();
    })
    .catch(err => {
        console.error('ENV DB CONNECT ERROR:', err.message);
        process.exit(1);
    });
