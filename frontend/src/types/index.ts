export type ContentType = 'email' | 'product_copy' | 'resume' | 'ux_copy' | 'essay' | 'general';

export type AnnotationCategory = 'clarity' | 'tone' | 'structure' | 'word_choice' | 'conciseness' | 'grammar';

export type AnnotationSeverity = 'critical' | 'warning' | 'suggestion';

export type Confidence = 'high' | 'medium' | 'low';

export interface Annotation {
  id: string;
  text: string;
  category: AnnotationCategory;
  severity: AnnotationSeverity;
  title: string;
  feedback: string;
  suggestion?: string;
  confidence: Confidence;
}

export interface AnalysisResult {
  annotations: Annotation[];
  overallScore: number;
  summary: string;
  strengths: string[];
  focusAreas: string[];
}

export type StudioStatus = 'idle' | 'analyzing' | 'complete' | 'error';
