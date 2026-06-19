import { runMigrations } from './migrate.js';
import { seedDatabase } from '../seed.js';
import { seedAdminUser } from '../seedAdmin.js';
import { seedVideos } from '../videosSeed.js';

export async function setupDatabase() {
  await runMigrations();
  await seedDatabase();
  await seedAdminUser();
  await seedVideos();
}
