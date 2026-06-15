import { Router } from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const phases = db.prepare('SELECT * FROM phases ORDER BY sort_order').all();

  const totalLessons = db.prepare('SELECT COUNT(*) as count FROM lessons').get().count;
  const completedLessons = db
    .prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = 1')
    .get(req.user.id).count;

  const phaseProgress = phases.map((phase) => {
    const total = db
      .prepare('SELECT COUNT(*) as count FROM lessons WHERE phase_id = ?')
      .get(phase.id).count;
    const completed = db
      .prepare(
        `SELECT COUNT(*) as count FROM user_progress up
         JOIN lessons l ON l.id = up.lesson_id
         WHERE up.user_id = ? AND l.phase_id = ? AND up.completed = 1`
      )
      .get(req.user.id, phase.id).count;

    const phaseRecord = db
      .prepare('SELECT * FROM user_phase_progress WHERE user_id = ? AND phase_id = ?')
      .get(req.user.id, phase.id);

    return {
      phaseId: phase.id,
      phaseNumber: phase.number,
      phaseTitle: phase.title,
      phaseSlug: phase.slug,
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      startedAt: phaseRecord?.started_at || null,
      completedAt: phaseRecord?.completed_at || null,
    };
  });

  const completedPhases = phaseProgress.filter((p) => p.percentage === 100 && p.total > 0).length;

  res.json({
    totalLessons,
    completedLessons,
    overallPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    completedPhases,
    totalPhases: phases.length,
    phases: phaseProgress,
  });
});

export default router;
