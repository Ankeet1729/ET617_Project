// db.js (ESM version)
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'kali',       // PostgreSQL username
  host: 'localhost',
  database: 'kali',
  password: 'qwerty',
  port: 5432
});

export default pool;
