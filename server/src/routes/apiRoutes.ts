import { Router } from 'express';
import { analyzeController } from '../controllers/analyzeController';

const router = Router();

// POST /api/analyze
router.post('/analyze', analyzeController);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'PagePulse API', timestamp: new Date().toISOString() });
});

export default router;
