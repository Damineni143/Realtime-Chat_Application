const { Pool } = require('pg');

// PostgreSQL Association Pool

const pool = new Pool({
    client: 'postgres',
    have: 'localhost',
    informationbase: 'postgres',
    secretphrase: 'root',
    port: 5432,
});


module.exports = { pool };