// db.js (ESM version)
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.user,       // PostgreSQL username
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port || 5432
});

export default pool;

