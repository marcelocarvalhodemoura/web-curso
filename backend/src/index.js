import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initDatabase } from './db/database.js';
import { seedDatabase } from './seed.js';
import { seedAdminUser } from './seedAdmin.js';
import { seedVideos } from './videosSeed.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import phasesRoutes from './routes/phases.js';
import lessonsRoutes from './routes/lessons.js';
import progressRoutes from './routes/progress.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API do curso funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/phases', phasesRoutes);
app.use('/api/phases/:phaseSlug/lessons', lessonsRoutes);
app.use('/api/progress', progressRoutes);

const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

async function bootstrap() {
  await initDatabase();
  await seedDatabase();
  await seedAdminUser();
  await seedVideos();

  app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
