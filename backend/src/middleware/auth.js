import jwt from 'jsonwebtoken';

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

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, JWT_SECRET);
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
