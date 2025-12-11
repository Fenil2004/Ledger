const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function query(text, params){
  return pool.query(text, params);
}

async function runSqlFromFile(filePath){
  const sql = fs.readFileSync(path.resolve(__dirname, filePath)).toString('utf-8');
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(Boolean);
  for (const stmt of statements){
    await pool.query(stmt);
  }
}

module.exports = { pool, query, runSqlFromFile };