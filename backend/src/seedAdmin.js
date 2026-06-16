import bcrypt from 'bcryptjs';
import db from './db/database.js';

export function seedAdminUser() {
  const email = (process.env.ADMIN_EMAIL || 'admin@devtrail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return;

  const hashed = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Administrador',
    email,
    hashed,
    'admin'
  );

  console.log(`✅ Usuário admin criado: ${email}`);
}
