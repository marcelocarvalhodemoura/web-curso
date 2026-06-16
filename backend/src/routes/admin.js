import { Router } from 'express';
import db from '../db/database.js';
import { adminMiddleware } from '../middleware/auth.js';
import { getProgressForUser } from '../services/progressService.js';

const router = Router();

router.use(adminMiddleware);

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

export default router;
