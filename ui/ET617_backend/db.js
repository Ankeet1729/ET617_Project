// db.js (ESM version)
import pg from 'pg';
const { Pool } = pg;

// const pool = new Pool({
//   user: 'kali',       // PostgreSQL username
//   host: 'localhost',
//   database: 'kali',
//   password: 'qwerty',
//   port: 5432
// });

const pool = new Pool({
  user: 'etuser',
  host: 'localhost',
  database: 'et617_db',
  password: 'password123',
  port: 5433
});

export default pool;
