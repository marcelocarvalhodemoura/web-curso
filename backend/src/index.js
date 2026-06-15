import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initDatabase } from './db/database.js';
import { seedDatabase } from './seed.js';
import { seedVideos } from './videosSeed.js';
import authRoutes from './routes/auth.js';
import phasesRoutes from './routes/phases.js';
import lessonsRoutes from './routes/lessons.js';
import progressRoutes from './routes/progress.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

initDatabase();
seedDatabase();
seedVideos();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API do curso funcionando' });
});

app.use('/api/auth', authRoutes);
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

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
