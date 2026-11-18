/**
 * Servidor SOLO para desarrollo local (npm run dev).
 * En Netlify NO se usa: allí los endpoints /api/* los atienden las
 * funciones de netlify/functions, que comparten la misma lógica (netlify/lib/ai.ts).
 */
import 'dotenv/config';
import express from 'express';
import { handleGenerateExercise, handleHealth, handleTutor } from './netlify/lib/ai.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    const r = handleHealth();
    res.status(r.status).json(r.body);
  });

  app.post('/api/tutor', async (req, res) => {
    const r = await handleTutor(req.body);
    res.status(r.status).json(r.body);
  });

  app.post('/api/exercises/generate', async (req, res) => {
    const r = await handleGenerateExercise(req.body);
    res.status(r.status).json(r.body);
  });

  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de desarrollo activo en http://localhost:${PORT}`);
  });
}

startServer();
