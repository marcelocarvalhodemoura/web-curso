import { get, all } from '../db/database.js';

export async function getProgressForUser(userId) {
  const phases = await all('SELECT * FROM phases ORDER BY sort_order');

  const totalLessonsRow = await get('SELECT COUNT(*) as count FROM lessons');
  const totalLessons = Number(totalLessonsRow.count);
  const completedLessonsRow = await get(
    'SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = 1',
    [userId]
  );
  const completedLessons = Number(completedLessonsRow.count);

  const phaseProgress = await Promise.all(
    phases.map(async (phase) => {
      const totalRow = await get('SELECT COUNT(*) as count FROM lessons WHERE phase_id = ?', [
        phase.id,
      ]);
      const total = Number(totalRow.count);
      const completedRow = await get(
        `SELECT COUNT(*) as count FROM user_progress up
         JOIN lessons l ON l.id = up.lesson_id
         WHERE up.user_id = ? AND l.phase_id = ? AND up.completed = 1`,
        [userId, phase.id]
      );
      const completed = Number(completedRow.count);

      const phaseRecord = await get(
        'SELECT * FROM user_phase_progress WHERE user_id = ? AND phase_id = ?',
        [userId, phase.id]
      );

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
    })
  );

  const completedPhases = phaseProgress.filter((p) => p.percentage === 100 && p.total > 0).length;

  return {
    totalLessons,
    completedLessons,
    overallPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    completedPhases,
    totalPhases: phases.length,
    phases: phaseProgress,
  };
}
