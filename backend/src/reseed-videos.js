import { initDatabase } from './db/database.js';
import { reseedVideos } from './videosSeed.js';
import db from './db/database.js';

initDatabase();
reseedVideos();

const count = db.prepare('SELECT COUNT(*) as c FROM lesson_videos').get().c;
const sample = db
  .prepare(
    `SELECT lv.youtube_id, lv.title, l.slug as lesson_slug, p.slug as phase_slug
     FROM lesson_videos lv
     JOIN lessons l ON l.id = lv.lesson_id
     JOIN phases p ON p.id = l.phase_id
     LIMIT 3`
  )
  .all();

console.log('Total videos:', count);
console.log(JSON.stringify(sample, null, 2));
