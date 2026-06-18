import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { get, all, run } from '../db/database.js';
import { adminMiddleware } from '../middleware/auth.js';
import { getProgressForUser } from '../services/progressService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const VALID_ROLES = ['student', 'admin'];

router.use(adminMiddleware);

function formatUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || 'student',
    active: row.active !== 0,
    created_at: row.created_at,
  };
}

async function countAdmins() {
  const row = await get(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`);
  return Number(row.count);
}

async function countActiveAdmins() {
  const row = await get(`SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND active = 1`);
  return Number(row.count);
}

router.get(
  '/students',
  asyncHandler(async (_req, res) => {
    const students = await all(
      `SELECT id, name, email, created_at FROM users WHERE role = 'student' AND active = 1 ORDER BY created_at DESC`
    );

    const result = await Promise.all(
      students.map(async (student) => ({
        ...student,
        progress: await getProgressForUser(student.id),
      }))
    );

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
  })
);

router.get(
  '/students/:id/progress',
  asyncHandler(async (req, res) => {
    const student = await get(
      `SELECT id, name, email, created_at FROM users WHERE id = ? AND role = 'student'`,
      [req.params.id]
    );

    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({
      ...student,
      progress: await getProgressForUser(student.id),
    });
  })
);

router.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const users = (await all(
      `SELECT id, name, email, role, active, created_at FROM users ORDER BY created_at DESC`
    )).map(formatUser);

    res.json({ users });
  })
);

router.post(
  '/users',
  asyncHandler(async (req, res) => {
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
    const existing = await get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const result = await run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
      name.trim(),
      normalizedEmail,
      hashed,
      role,
    ]);

    const user = await get('SELECT id, name, email, role, active, created_at FROM users WHERE id = ?', [
      result.lastInsertRowid,
    ]);

    res.status(201).json({ user: formatUser(user) });
  })
);

router.put(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const targetId = Number(req.params.id);
    const { name, email, password, role, active } = req.body;

    const existing = await get('SELECT * FROM users WHERE id = ?', [targetId]);
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
      const emailTaken = await get('SELECT id FROM users WHERE email = ? AND id != ?', [
        normalizedEmail,
        targetId,
      ]);
      if (emailTaken) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }
      updates.email = normalizedEmail;
    }

    if (role !== undefined) {
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
      }
      if (existing.role === 'admin' && role === 'student' && (await countAdmins()) <= 1) {
        return res.status(400).json({ error: 'Não é possível remover o último administrador' });
      }
      updates.role = role;
    }

    if (active !== undefined) {
      const willBeActive = !!active;
      if (!willBeActive && targetId === req.user.id) {
        return res.status(400).json({ error: 'Você não pode desativar sua própria conta' });
      }
      if (!willBeActive && existing.role === 'admin' && (await countActiveAdmins()) <= 1) {
        return res.status(400).json({ error: 'Não é possível desativar o último administrador ativo' });
      }
      updates.active = willBeActive ? 1 : 0;
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

    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    await run(`UPDATE users SET ${fields} WHERE id = ?`, [...Object.values(updates), targetId]);

    const user = await get('SELECT id, name, email, role, active, created_at FROM users WHERE id = ?', [
      targetId,
    ]);

    res.json({ user: formatUser(user) });
  })
);

router.delete(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const targetId = Number(req.params.id);

    if (targetId === req.user.id) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
    }

    const existing = await get('SELECT * FROM users WHERE id = ?', [targetId]);
    if (!existing) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (existing.role === 'admin' && (await countAdmins()) <= 1) {
      return res.status(400).json({ error: 'Não é possível excluir o último administrador' });
    }

    await run('DELETE FROM users WHERE id = ?', [targetId]);
    res.json({ message: 'Usuário excluído com sucesso' });
  })
);

export default router;
