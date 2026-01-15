const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgresql://postgres:pgp%40123jaipur@db.acbdzgrcvsrqbaocjlpn.supabase.co:5432/postgres',
});
client.connect()
    .then(() => {
        console.log('PG CONNECT SUCCESS');
        client.end();
    })
    .catch(err => {
        console.error('PG CONNECT ERROR:', err.message);
        process.exit(1);
    });
