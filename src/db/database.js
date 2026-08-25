import { Database } from "bun:sqlite";

const db = new Database("src/db/sih.db") ;

const initDB = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS beneficiaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      education TEXT,
      occupation TEXT,
      skills TEXT,
      interests TEXT,
      mobility TEXT,
      employment_preference TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
export  {db,initDB};