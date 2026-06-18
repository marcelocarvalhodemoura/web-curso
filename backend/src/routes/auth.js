import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { get, run } from '../db/database.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const result = await run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name.trim(),
      email.toLowerCase().trim(),
      hashed,
    ]);

    const user = {
      id: result.lastInsertRowid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'student',
    };
    const token = generateToken(user);

    res.status(201).json({ user, token });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    if (!user.active) {
      return res.status(403).json({ error: 'Conta desativada. Entre em contato com o administrador.' });
    }

    const { password: _, ...safeUser } = user;
    safeUser.role = safeUser.role || 'student';
    const token = generateToken(safeUser);

    res.json({ user: safeUser, token });
  })
);

router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = await get('SELECT id, name, email, role, active, created_at FROM users WHERE id = ?', [
      req.user.id,
    ]);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ ...user, active: !!user.active });
  })
);

export default router;
