import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/database.js';
import { adminMiddleware } from '../middleware/auth.js';
import { getProgressForUser } from '../services/progressService.js';

const router = Router();
const VALID_ROLES = ['student', 'admin'];

router.use(adminMiddleware);

function formatUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || 'student',
    created_at: row.created_at,
  };
}

function countAdmins() {
  return db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`).get().count;
}

router.get('/students', (_req, res) => {
  const students = db
    .prepare(
      `SELECT id, name, email, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC`
    )
    .all();

  const result = students.map((student) => ({
    ...student,
    progress: getProgressForUser(student.id),
  }));

  const totalStudents = result.length;
  const avgProgress =
    totalStudents > 0
      ? Math.round(result.reduce((sum, s) => sum + s.progress.overallPercentage, 0) / totalStudents)
      : 0;
  const activeStudents = result.filter((s) => s.progress.completedLessons > 0).length;

  res.json({
    summary: { totalStudents, activeStudents, avgProgress },
    students: result,
  });
});

router.get('/students/:id/progress', (req, res) => {
  const student = db
    .prepare(`SELECT id, name, email, created_at FROM users WHERE id = ? AND role = 'student'`)
    .get(req.params.id);

  if (!student) {
    return res.status(404).json({ error: 'Aluno não encontrado' });
  }

  res.json({
    ...student,
    progress: getProgressForUser(student.id),
  });
});

router.get('/users', (_req, res) => {
  const users = db
    .prepare(`SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`)
    .all()
    .map(formatUser);

  res.json({ users });
});

router.post('/users', (req, res) => {
  const { name, email, password, role = 'student' } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Tipo de usuário inválido' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
    .run(name.trim(), normalizedEmail, hashed, role);

  const user = db
    .prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json({ user: formatUser(user) });
});

router.put('/users/:id', (req, res) => {
  const targetId = Number(req.params.id);
  const { name, email, password, role } = req.body;

  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);
  if (!existing) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const updates = {};
  if (name !== undefined) {
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    updates.name = name.trim();
  }

  if (email !== undefined) {
    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const emailTaken = db
      .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
      .get(normalizedEmail, targetId);
    if (emailTaken) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    updates.email = normalizedEmail;
  }

  if (role !== undefined) {
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }
    if (existing.role === 'admin' && role === 'student' && countAdmins() <= 1) {
      return res.status(400).json({ error: 'Não é possível remover o último administrador' });
    }
    updates.role = role;
  }

  if (password !== undefined && password !== '') {
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }
    updates.password = bcrypt.hashSync(password, 10);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar' });
  }

  const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
  db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(...Object.values(updates), targetId);

  const user = db
    .prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?')
    .get(targetId);

  res.json({ user: formatUser(user) });
});

router.delete('/users/:id', (req, res) => {
  const targetId = Number(req.params.id);

  if (targetId === req.user.id) {
    return res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
  }

  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);
  if (!existing) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  if (existing.role === 'admin' && countAdmins() <= 1) {
    return res.status(400).json({ error: 'Não é possível excluir o último administrador' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(targetId);
  res.json({ message: 'Usuário excluído com sucesso' });
});

export default router;
