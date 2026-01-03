const Database = require("better-sqlite3");

// Open (or create) the database
const db = new Database("./urls.db");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE,
    original_url TEXT,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT,
    user_agent TEXT,
    ip TEXT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
