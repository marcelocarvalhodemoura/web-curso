import { Router } from 'express';
import db from '../db/database.js';
import { authMiddleware, tryGetAuthUser, isStudentUser } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/:slug', (req, res) => {
  const lesson = db
    .prepare(
      `SELECT l.*, p.title as phase_title, p.slug as phase_slug, p.number as phase_number
       FROM lessons l
       JOIN phases p ON p.id = l.phase_id
       WHERE l.slug = ? AND p.slug = ?`
    )
    .get(req.params.slug, req.params.phaseSlug);

  if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });

  const siblings = db
    .prepare('SELECT id, title, slug, sort_order FROM lessons WHERE phase_id = ? ORDER BY sort_order')
    .all(lesson.phase_id);

  const videos = db
    .prepare('SELECT youtube_id, title, channel, sort_order FROM lesson_videos WHERE lesson_id = ? ORDER BY sort_order')
    .all(lesson.id);

  const user = tryGetAuthUser(req);
  const canWatchVideos = isStudentUser(user);

  const currentIndex = siblings.findIndex((s) => s.slug === lesson.slug);
  const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  res.json({
    ...lesson,
    videos: canWatchVideos ? videos : [],
    videosLocked: !canWatchVideos && videos.length > 0,
    prev,
    next,
  });
});

router.post('/:slug/complete', authMiddleware, (req, res) => {
  const lesson = db
    .prepare(
      `SELECT l.* FROM lessons l
       JOIN phases p ON p.id = l.phase_id
       WHERE l.slug = ? AND p.slug = ?`
    )
    .get(req.params.slug, req.params.phaseSlug);

  if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });

  db.prepare(
    `INSERT INTO user_progress (user_id, lesson_id, completed, completed_at)
     VALUES (?, ?, 1, datetime('now'))
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed = 1, completed_at = datetime('now')`
  ).run(req.user.id, lesson.id);

  db.prepare(
    `INSERT INTO user_phase_progress (user_id, phase_id) VALUES (?, ?)
     ON CONFLICT(user_id, phase_id) DO NOTHING`
  ).run(req.user.id, lesson.phase_id);

  const totalLessons = db
    .prepare('SELECT COUNT(*) as count FROM lessons WHERE phase_id = ?')
    .get(lesson.phase_id).count;
  const completedLessons = db
    .prepare(
      `SELECT COUNT(*) as count FROM user_progress up
       JOIN lessons l ON l.id = up.lesson_id
       WHERE up.user_id = ? AND l.phase_id = ? AND up.completed = 1`
    )
    .get(req.user.id, lesson.phase_id).count;

  if (completedLessons >= totalLessons) {
    db.prepare(
      `UPDATE user_phase_progress SET completed_at = datetime('now')
       WHERE user_id = ? AND phase_id = ? AND completed_at IS NULL`
    ).run(req.user.id, lesson.phase_id);
  }

  res.json({ success: true, completedLessons, totalLessons });
});

router.delete('/:slug/complete', authMiddleware, (req, res) => {
  const lesson = db
    .prepare(
      `SELECT l.* FROM lessons l
       JOIN phases p ON p.id = l.phase_id
       WHERE l.slug = ? AND p.slug = ?`
    )
    .get(req.params.slug, req.params.phaseSlug);

  if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });

  db.prepare(
    `UPDATE user_progress SET completed = 0, completed_at = NULL
     WHERE user_id = ? AND lesson_id = ?`
  ).run(req.user.id, lesson.id);

  db.prepare(
    `UPDATE user_phase_progress SET completed_at = NULL
     WHERE user_id = ? AND phase_id = ?`
  ).run(req.user.id, lesson.phase_id);

  res.json({ success: true });
});

export default router;
