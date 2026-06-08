import { AnalysisResult, ContentType } from '../types';

const BASE = '/api';

export async function analyzeText(text: string, contentType: ContentType): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, contentType }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error ?? 'Analysis failed');
  }
  return res.json() as Promise<AnalysisResult>;
}
