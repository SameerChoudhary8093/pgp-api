const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgresql://postgres:pgp%40123jaipur@db.jgtseacyfwgbpltvlxno.supabase.co:6543/postgres',
});
client.connect()
    .then(() => {
        console.log('ENV DB CONNECT SUCCESS');
        client.end();
    })
    .catch(err => {
        console.error('ENV DB CONNECT ERROR:', err.message);
        process.exit(1);
    });
