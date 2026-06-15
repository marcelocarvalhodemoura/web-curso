import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = Router();

function getPhaseProgress(userId, phaseId) {
  const totalLessons = db
    .prepare('SELECT COUNT(*) as count FROM lessons WHERE phase_id = ?')
    .get(phaseId).count;

  const completedLessons = db
    .prepare(
      `SELECT COUNT(*) as count FROM user_progress up
       JOIN lessons l ON l.id = up.lesson_id
       WHERE up.user_id = ? AND l.phase_id = ? AND up.completed = 1`
    )
    .get(userId, phaseId).count;

  return {
    totalLessons,
    completedLessons,
    percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

router.get('/', (req, res) => {
  const phases = db
    .prepare('SELECT * FROM phases ORDER BY sort_order ASC')
    .all();

  const userId = req.headers.authorization ? tryGetUserId(req) : null;

  const result = phases.map((phase) => {
    const lessonCount = db
      .prepare('SELECT COUNT(*) as count FROM lessons WHERE phase_id = ?')
      .get(phase.id).count;
    const exerciseCount = db
      .prepare('SELECT COUNT(*) as count FROM exercises WHERE phase_id = ?')
      .get(phase.id).count;

    const data = {
      ...phase,
      lessonCount,
      exerciseCount,
    };

    if (userId) {
      data.progress = getPhaseProgress(userId, phase.id);
    }

    return data;
  });

  res.json(result);
});

router.get('/:slug', (req, res) => {
  const phase = db.prepare('SELECT * FROM phases WHERE slug = ?').get(req.params.slug);
  if (!phase) return res.status(404).json({ error: 'Fase não encontrada' });

  const lessons = db
    .prepare('SELECT id, title, slug, type, sort_order FROM lessons WHERE phase_id = ? ORDER BY sort_order')
    .all(phase.id);

  const exercises = db
    .prepare('SELECT * FROM exercises WHERE phase_id = ? ORDER BY sort_order')
    .all(phase.id);

  const tools = db
    .prepare('SELECT * FROM tools WHERE phase_id = ? ORDER BY sort_order')
    .all(phase.id);

  const userId = tryGetUserId(req);
  let progress = null;
  let lessonProgress = {};

  if (userId) {
    progress = getPhaseProgress(userId, phase.id);
    const rows = db
      .prepare(
        `SELECT up.lesson_id, up.completed FROM user_progress up
         JOIN lessons l ON l.id = up.lesson_id
         WHERE up.user_id = ? AND l.phase_id = ?`
      )
      .all(userId, phase.id);
    lessonProgress = Object.fromEntries(rows.map((r) => [r.lesson_id, r.completed === 1]));
  }

  res.json({ ...phase, lessons, exercises, tools, progress, lessonProgress });
});

function tryGetUserId(req) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return null;
    const decoded = jwt.verify(header.slice(7), JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

export default router;
