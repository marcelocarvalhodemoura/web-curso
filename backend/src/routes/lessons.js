import { Router } from 'express';
import { get, all, run } from '../db/database.js';
import { authMiddleware, tryGetAuthUser, isStudentUser } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router({ mergeParams: true });

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const lesson = await get(
      `SELECT l.*, p.title as phase_title, p.slug as phase_slug, p.number as phase_number
       FROM lessons l
       JOIN phases p ON p.id = l.phase_id
       WHERE l.slug = ? AND p.slug = ?`,
      [req.params.slug, req.params.phaseSlug]
    );

    if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });

    const siblings = await all(
      'SELECT id, title, slug, sort_order FROM lessons WHERE phase_id = ? ORDER BY sort_order',
      [lesson.phase_id]
    );

    const videos = await all(
      'SELECT youtube_id, title, channel, sort_order FROM lesson_videos WHERE lesson_id = ? ORDER BY sort_order',
      [lesson.id]
    );

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
  })
);

router.post(
  '/:slug/complete',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const lesson = await get(
      `SELECT l.* FROM lessons l
       JOIN phases p ON p.id = l.phase_id
       WHERE l.slug = ? AND p.slug = ?`,
      [req.params.slug, req.params.phaseSlug]
    );

    if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });

    await run(
      `INSERT INTO user_progress (user_id, lesson_id, completed, completed_at)
       VALUES (?, ?, 1, datetime('now'))
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed = 1, completed_at = datetime('now')`,
      [req.user.id, lesson.id]
    );

    await run(
      `INSERT INTO user_phase_progress (user_id, phase_id) VALUES (?, ?)
       ON CONFLICT(user_id, phase_id) DO NOTHING`,
      [req.user.id, lesson.phase_id]
    );

    const totalLessonsRow = await get('SELECT COUNT(*) as count FROM lessons WHERE phase_id = ?', [
      lesson.phase_id,
    ]);
    const totalLessons = Number(totalLessonsRow.count);
    const completedLessonsRow = await get(
      `SELECT COUNT(*) as count FROM user_progress up
       JOIN lessons l ON l.id = up.lesson_id
       WHERE up.user_id = ? AND l.phase_id = ? AND up.completed = 1`,
      [req.user.id, lesson.phase_id]
    );
    const completedLessons = Number(completedLessonsRow.count);

    if (completedLessons >= totalLessons) {
      await run(
        `UPDATE user_phase_progress SET completed_at = datetime('now')
         WHERE user_id = ? AND phase_id = ? AND completed_at IS NULL`,
        [req.user.id, lesson.phase_id]
      );
    }

    res.json({ success: true, completedLessons, totalLessons });
  })
);

router.delete(
  '/:slug/complete',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const lesson = await get(
      `SELECT l.* FROM lessons l
       JOIN phases p ON p.id = l.phase_id
       WHERE l.slug = ? AND p.slug = ?`,
      [req.params.slug, req.params.phaseSlug]
    );

    if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });

    await run(
      `UPDATE user_progress SET completed = 0, completed_at = NULL
       WHERE user_id = ? AND lesson_id = ?`,
      [req.user.id, lesson.id]
    );

    await run(
      `UPDATE user_phase_progress SET completed_at = NULL
       WHERE user_id = ? AND phase_id = ?`,
      [req.user.id, lesson.phase_id]
    );

    res.json({ success: true });
  })
);

export default router;
