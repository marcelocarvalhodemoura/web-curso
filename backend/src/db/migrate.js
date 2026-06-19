import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { all, exec, run, get } from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationsTable() {
  await exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

async function getAppliedMigrations() {
  const rows = await all('SELECT name FROM schema_migrations ORDER BY name');
  return new Set(rows.map((row) => row.name));
}

async function ensureLegacyUserColumns() {
  const userColumns = await all('PRAGMA table_info(users)');
  if (!userColumns.some((col) => col.name === 'role')) {
    await exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'student'");
  }
  if (!userColumns.some((col) => col.name === 'active')) {
    await exec('ALTER TABLE users ADD COLUMN active INTEGER NOT NULL DEFAULT 1');
  }
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();
}

async function applyMigration(name) {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, name), 'utf8');
  await exec(sql);
  await run('INSERT INTO schema_migrations (name) VALUES (?)', [name]);
}

export async function runMigrations() {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const pending = listMigrationFiles().filter((name) => !applied.has(name));

  for (const name of pending) {
    console.log(`⏳ Aplicando migration: ${name}`);
    await applyMigration(name);
    console.log(`✅ Migration aplicada: ${name}`);
  }

  await ensureLegacyUserColumns();

  if (pending.length === 0) {
    console.log('✅ Nenhuma migration pendente');
  }

  return { applied: pending, skipped: [...applied] };
}

export async function getMigrationStatus() {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const allMigrations = listMigrationFiles();

  return {
    target: process.env.TURSO_DATABASE_URL ? 'turso' : 'local',
    applied: allMigrations.filter((name) => applied.has(name)),
    pending: allMigrations.filter((name) => !applied.has(name)),
  };
}

export async function getDatabaseSummary() {
  const [phases, lessons, videos, users] = await Promise.all([
    get('SELECT COUNT(*) as count FROM phases'),
    get('SELECT COUNT(*) as count FROM lessons'),
    get('SELECT COUNT(*) as count FROM lesson_videos'),
    get('SELECT COUNT(*) as count FROM users'),
  ]);

  return {
    phases: Number(phases?.count ?? 0),
    lessons: Number(lessons?.count ?? 0),
    videos: Number(videos?.count ?? 0),
    users: Number(users?.count ?? 0),
  };
}
