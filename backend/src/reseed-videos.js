import { setupDatabase } from './db/setup.js';
import { reseedVideos } from './videosSeed.js';
import { get, all } from './db/database.js';

await setupDatabase();
await reseedVideos();

const countRow = await get('SELECT COUNT(*) as c FROM lesson_videos');
const sample = await all(
  `SELECT lv.youtube_id, lv.title, l.slug as lesson_slug, p.slug as phase_slug
   FROM lesson_videos lv
   JOIN lessons l ON l.id = lv.lesson_id
   JOIN phases p ON p.id = l.phase_id
   LIMIT 3`
);

console.log('Total videos:', countRow.c);
console.log(JSON.stringify(sample, null, 2));
