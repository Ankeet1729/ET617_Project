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

// db.js (ESM) - env-driven
// import pg from 'pg';
// const { Pool } = pg;

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'password123',
//   port: 5432
// });



// export default pool;

