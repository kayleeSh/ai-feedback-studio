import { Router, Request, Response } from 'express';
import { rewriteText, ContentType } from '../services/aiService';

export const rewriteRouter = Router();

rewriteRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const { text, contentType = 'general' } = req.body as { text?: string; contentType?: ContentType };

  if (!text || text.trim().length < 20) {
    res.status(400).json({ error: 'Please provide at least 20 characters of text.' });
    return;
  }

  if (text.length > 5000) {
    res.status(400).json({ error: 'Text must be under 5000 characters.' });
    return;
  }

  try {
    const improvedText = await rewriteText(text.trim(), contentType);
    res.json({ improvedText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Rewrite failed';
    console.error('[rewrite error]', message);
    res.status(500).json({ error: message });
  }
});
