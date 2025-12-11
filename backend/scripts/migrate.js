const db = require('../db');

async function migrate(){
  await db.runSqlFromFile('./db.sql');
  console.log('migrations applied');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});