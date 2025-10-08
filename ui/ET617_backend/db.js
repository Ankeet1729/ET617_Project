// db.js (ESM version)
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',       // PostgreSQL username
  host: 'localhost',
  database: 'postgres',
  password: 'kuch_bhi',
  port: 5432
});

