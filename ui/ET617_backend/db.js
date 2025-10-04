const { Pool } = require('pg');
const pool = new Pool({
  user: 'kali',      // PostgreSQL username
  host: 'localhost',
  database: 'kali',
  password: 'qwerty',
  port: 5432
});
module.exports = pool;
