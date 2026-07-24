import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development & production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '2mb' }));

// API Routes
app.use('/api', apiRoutes);

// Root Welcome Endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'PagePulse API Server',
    version: '1.0.0',
    description: 'Production Website Auditing SaaS API',
    endpoints: {
      health: 'GET /api/health',
      analyze: 'POST /api/analyze'
    }
  });
});

// Central Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚡ PagePulse API Server running at http://localhost:${PORT}`);
  });
}

export default app;
