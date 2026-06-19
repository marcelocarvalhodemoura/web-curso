import dotenv from 'dotenv';
import { createClient } from '@libsql/client/node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

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
