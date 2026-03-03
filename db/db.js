const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbDir = __dirname;
const dbPath = path.join(dbDir, "database.sqlite");
const initSqlPath = path.join(dbDir, "init.sql");

// Ensure db folder exists (it does, but safe)
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Open DB
const db = new sqlite3.Database(dbPath);

// Run init.sql once on startup + run any needed migrations
function initDb() {
  const initSql = fs.readFileSync(initSqlPath, "utf-8");
  return new Promise((resolve, reject) => {
    db.exec(initSql, (err) => {
      if (err) return reject(err);

      // Migration: add created_by column if it doesn't exist yet
      db.all("PRAGMA table_info(models)", (err2, cols) => {
        if (err2) return reject(err2);
        const hasCreatedBy = cols.some((c) => c.name === "created_by");
        if (!hasCreatedBy) {
          db.run("ALTER TABLE models ADD COLUMN created_by INTEGER", (err3) => {
            if (err3) return reject(err3);
            console.log("Migration: added created_by column to models");
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  });
}

// Promisified helpers
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { db, initDb, run, get, all };
