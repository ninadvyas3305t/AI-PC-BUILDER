import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { listComponents, getBuildComponents } from './components.js';
import { checkCompatibility } from './compatibility.js';
import { estimatePerformance } from './performance.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/components/:category', async (req, res, next) => {
  try {
    const components = await listComponents(req.params.category);
    if (!components) return res.status(404).json({ error: 'Unknown component category.' });
    res.json(components);
  } catch (error) {
    next(error);
  }
});

app.post('/api/builds/check-compatibility', async (req, res, next) => {
  try {
    const parts = await getBuildComponents(req.body.components ?? {});
    const compatibility = checkCompatibility(parts);
    const performance = estimatePerformance(parts);
    res.json({ ...compatibility, performance });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'The database request failed. Is PostgreSQL running and seeded?' });
});

app.listen(process.env.PORT || 3001, () => console.log('API running on http://localhost:3001'));
