// import Database from 'better-sqlite3';
import Database = require('better-sqlite3');
import { join } from 'path';

const dbPath = join(__dirname, '..', 'data', 'authentification.db');

const db = new Database(dbPath);

db.prepare(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE,
		email TEXT NOT NULL UNIQUE, 
		password TEXT,
		two_fa_enabled INTEGER DEFAULT 0,
		email_2fa_code VARCHAR(6),
		email_2fa_code_expires TIMESTAMP,
		email_2fa_attempts INTEGER DEFAULT 0
	)
`).run();
//remettre umail en unqiue

const addColumnIfNotExists = (columnName: string, columnDef: string) => {
  try {
    db.prepare(`ALTER TABLE users ADD COLUMN ${columnName} ${columnDef}`).run();
  } catch (e) {}
};

addColumnIfNotExists('two_fa_enabled', 'INTEGER DEFAULT 0');
addColumnIfNotExists('email_2fa_code', 'VARCHAR(6)');
addColumnIfNotExists('email_2fa_code_expires', 'TIMESTAMP');
addColumnIfNotExists('email_2fa_attempts', 'INTEGER DEFAULT 0');

export default db;