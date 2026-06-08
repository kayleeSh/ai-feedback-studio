import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeRouter } from './routes/analyze';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/api/analyze', analyzeRouter);

app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
  if (!process.env.GROQ_API_KEY) {
    console.log('[server] No GROQ_API_KEY — running in mock mode');
  }
});
