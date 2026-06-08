export type ContentType = 'email' | 'product_copy' | 'resume' | 'ux_copy' | 'essay' | 'general';

export interface Annotation {
  id: string;
  text: string;
  category: 'clarity' | 'tone' | 'structure' | 'word_choice' | 'conciseness' | 'grammar';
  severity: 'critical' | 'warning' | 'suggestion';
  title: string;
  feedback: string;
  suggestion?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  annotations: Annotation[];
  overallScore: number;
  summary: string;
  strengths: string[];
  focusAreas: string[];
}

const CONTENT_LABELS: Record<ContentType, string> = {
  email:        'professional email',
  product_copy: 'product marketing copy',
  resume:       'resume / CV',
  ux_copy:      'UX microcopy and UI text',
  essay:        'essay or long-form writing',
  general:      'general writing',
};

const ANALYSIS_PROMPT = (text: string, contentType: ContentType) =>
  `You are an expert writing coach specialising in ${CONTENT_LABELS[contentType]}. Analyse the following text and identify specific passages that can be improved.

Return ONLY valid JSON — no markdown, no explanation:
{
  "annotations": [
    {
      "id": "ann-1",
      "text": "exact verbatim substring from the input to highlight",
      "category": "clarity|tone|structure|word_choice|conciseness|grammar",
      "severity": "critical|warning|suggestion",
      "title": "Brief issue title (3-6 words)",
      "feedback": "Clear explanation of the issue (1-2 sentences)",
      "suggestion": "Rewritten version or concrete fix",
      "confidence": "high|medium|low"
    }
  ],
  "overallScore": 72,
  "summary": "2-sentence overall assessment of the writing quality",
  "strengths": ["specific strength in the writing"],
  "focusAreas": ["specific area to improve"]
}

Rules:
- annotations: 3-7 specific, actionable issues
- text: MUST be an exact verbatim substring of the input (used for highlighting — copy-paste accuracy required)
- severity: critical (blocks communication), warning (notable friction), suggestion (enhancement)
- confidence: high (certain), medium (probable), low (possible)
- overallScore: 0-100
- strengths: 2-3 items
- focusAreas: 2-3 items

Input text:
${text}`;

async function groqFetch(body: object): Promise<Response> {
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
}

function mockAnalysis(text: string): AnalysisResult {
  const words = text.split(/\s+/);
  const firstSentence = text.split(/[.!?]/)[0]?.trim() ?? text.slice(0, 60);
  const midChunk = words.slice(Math.floor(words.length / 3), Math.floor(words.length / 3) + 6).join(' ');

  return {
    overallScore: 68,
    summary: 'The writing shows clear intent but has opportunities for stronger clarity and conciseness. Several passages could be tightened to increase impact and reader engagement.',
    strengths: [
      'Clear overall structure and logical flow',
      'Appropriate tone for the content type',
    ],
    focusAreas: [
      'Reduce passive voice constructions',
      'Tighten verbose phrases for greater impact',
    ],
    annotations: [
      {
        id: 'ann-1',
        text: firstSentence,
        category: 'clarity',
        severity: 'warning',
        title: 'Opening could be stronger',
        feedback: 'The opening sentence takes too long to reach the main point. Readers decide within the first sentence whether to continue.',
        suggestion: 'Lead with your core message directly.',
        confidence: 'high',
      },
      {
        id: 'ann-2',
        text: midChunk,
        category: 'conciseness',
        severity: 'suggestion',
        title: 'Verbose phrasing',
        feedback: 'This phrase uses more words than necessary, which dilutes the impact of the surrounding content.',
        suggestion: 'Consider a shorter, more direct phrasing.',
        confidence: 'medium',
      },
    ],
  };
}

export async function analyzeText(text: string, contentType: ContentType): Promise<AnalysisResult> {
  if (!process.env.GROQ_API_KEY) {
    await new Promise(r => setTimeout(r, 1800));
    return mockAnalysis(text);
  }

  const res = await groqFetch({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: ANALYSIS_PROMPT(text, contentType) }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error('No content from Groq');

  const parsed = JSON.parse(content) as AnalysisResult;
  return {
    ...parsed,
    annotations: (parsed.annotations ?? []).map((a, i) => ({ ...a, id: `ann-${i + 1}` })),
  };
}
