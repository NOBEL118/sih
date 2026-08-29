import { Database } from "bun:sqlite";

const dbPath = process.env.NODE_ENV === "production" ? "/data/sih.db" : "src/db/sih.db";
const db = new Database(dbPath);

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
      phone NUMBER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export { db, initDB };