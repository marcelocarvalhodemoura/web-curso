import jwt from 'jsonwebtoken';
import { get } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'web-curso-dev-secret-change-in-production';

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role || 'student' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  });
}

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    const dbUser = await get('SELECT id, name, email, role, active FROM users WHERE id = ?', [
      payload.id,
    ]);

    if (!dbUser) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!dbUser.active) {
      return res.status(403).json({ error: 'Conta desativada' });
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role || 'student',
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export function tryGetAuthUser(req) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return null;
    return jwt.verify(header.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
}

export function isStudentUser(user) {
  if (!user) return false;
  const role = user.role || 'student';
  return role === 'student';
}

export { JWT_SECRET };
