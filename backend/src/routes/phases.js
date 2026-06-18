import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { get, all } from '../db/database.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

async function getPhaseProgress(userId, phaseId) {
  const totalLessonsRow = await get('SELECT COUNT(*) as count FROM lessons WHERE phase_id = ?', [
    phaseId,
  ]);
  const totalLessons = Number(totalLessonsRow.count);

  const completedLessonsRow = await get(
    `SELECT COUNT(*) as count FROM user_progress up
     JOIN lessons l ON l.id = up.lesson_id
     WHERE up.user_id = ? AND l.phase_id = ? AND up.completed = 1`,
    [userId, phaseId]
  );
  const completedLessons = Number(completedLessonsRow.count);

  return {
    totalLessons,
    completedLessons,
    percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const phases = await all('SELECT * FROM phases ORDER BY sort_order ASC');
    const userId = req.headers.authorization ? tryGetUserId(req) : null;

    const result = await Promise.all(
      phases.map(async (phase) => {
        const lessonCountRow = await get('SELECT COUNT(*) as count FROM lessons WHERE phase_id = ?', [
          phase.id,
        ]);
        const exerciseCountRow = await get('SELECT COUNT(*) as count FROM exercises WHERE phase_id = ?', [
          phase.id,
        ]);

        const data = {
          ...phase,
          lessonCount: Number(lessonCountRow.count),
          exerciseCount: Number(exerciseCountRow.count),
        };

        if (userId) {
          data.progress = await getPhaseProgress(userId, phase.id);
        }

        return data;
      })
    );

    res.json(result);
  })
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const phase = await get('SELECT * FROM phases WHERE slug = ?', [req.params.slug]);
    if (!phase) return res.status(404).json({ error: 'Fase não encontrada' });

    const lessons = await all(
      'SELECT id, title, slug, type, sort_order FROM lessons WHERE phase_id = ? ORDER BY sort_order',
      [phase.id]
    );

    const exercises = await all(
      'SELECT * FROM exercises WHERE phase_id = ? ORDER BY sort_order',
      [phase.id]
    );

    const tools = await all('SELECT * FROM tools WHERE phase_id = ? ORDER BY sort_order', [phase.id]);

    const userId = tryGetUserId(req);
    let progress = null;
    let lessonProgress = {};

    if (userId) {
      progress = await getPhaseProgress(userId, phase.id);
      const rows = await all(
        `SELECT up.lesson_id, up.completed FROM user_progress up
         JOIN lessons l ON l.id = up.lesson_id
         WHERE up.user_id = ? AND l.phase_id = ?`,
        [userId, phase.id]
      );
      lessonProgress = Object.fromEntries(rows.map((r) => [r.lesson_id, r.completed === 1]));
    }

    res.json({ ...phase, lessons, exercises, tools, progress, lessonProgress });
  })
);

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
