import { createClient } from '@libsql/client/node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || path.join(__dirname, '../../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'curso.db');

const client = process.env.TURSO_DATABASE_URL
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : createClient({ url: `file:${dbPath}` });

export async function get(sql, args = []) {
  const result = await client.execute({ sql, args });
  return result.rows[0];
}

export async function all(sql, args = []) {
  const result = await client.execute({ sql, args });
  return [...result.rows];
}

export async function run(sql, args = []) {
  const result = await client.execute({ sql, args });
  return {
    lastInsertRowid: Number(result.lastInsertRowid ?? 0),
    changes: result.rowsAffected ?? 0,
  };
}

export async function exec(sql) {
  await client.executeMultiple(sql);
}

export async function transaction(fn) {
  const txn = await client.transaction('write');
  const tx = {
    get: async (sql, args = []) => {
      const result = await txn.execute({ sql, args });
      return result.rows[0];
    },
    all: async (sql, args = []) => {
      const result = await txn.execute({ sql, args });
      return [...result.rows];
    },
    run: async (sql, args = []) => {
      const result = await txn.execute({ sql, args });
      return {
        lastInsertRowid: Number(result.lastInsertRowid ?? 0),
        changes: result.rowsAffected ?? 0,
      };
    },
  };

  try {
    await fn(tx);
    await txn.commit();
  } catch (err) {
    await txn.rollback();
    throw err;
  } finally {
    txn.close();
  }
}

export async function initDatabase() {
  await exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS phases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER UNIQUE NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      objective TEXT NOT NULL,
      duration_weeks INTEGER NOT NULL,
      expected_result TEXT NOT NULL,
      project TEXT,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'content',
      sort_order INTEGER NOT NULL,
      FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE,
      UNIQUE(phase_id, slug)
    );

    CREATE TABLE IF NOT EXISTS lesson_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      youtube_id TEXT NOT NULL,
      title TEXT NOT NULL,
      channel TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phase_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      url TEXT,
      sort_order INTEGER NOT NULL,
      FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
      UNIQUE(user_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS user_phase_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      phase_id INTEGER NOT NULL,
      started_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE,
      UNIQUE(user_id, phase_id)
    );
  `);

  const userColumns = await all('PRAGMA table_info(users)');
  if (!userColumns.some((col) => col.name === 'role')) {
    await exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'student'");
  }
  if (!userColumns.some((col) => col.name === 'active')) {
    await exec('ALTER TABLE users ADD COLUMN active INTEGER NOT NULL DEFAULT 1');
  }
}
