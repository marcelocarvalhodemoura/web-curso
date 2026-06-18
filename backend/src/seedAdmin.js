import bcrypt from 'bcryptjs';
import { get, run } from './db/database.js';

export async function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL || 'admin@devtrail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) return;

  const hashed = bcrypt.hashSync(password, 10);
  await run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
    'Administrador',
    email,
    hashed,
    'admin',
  ]);

  console.log(`✅ Usuário admin criado: ${email}`);
}
