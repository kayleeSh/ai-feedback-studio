import { AnnotationCategory, AnnotationSeverity } from '../types';

const CATEGORY_LABEL: Record<AnnotationCategory, string> = {
  clarity:     'Clarity',
  tone:        'Tone',
  structure:   'Structure',
  word_choice: 'Word Choice',
  conciseness: 'Conciseness',
  grammar:     'Grammar',
};

const SEVERITY_CONFIG: Record<AnnotationSeverity, { label: string; color: string; bg: string; border: string }> = {
  critical:   { label: 'Critical',    color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  warning:    { label: 'Warning',     color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  suggestion: { label: 'Suggestion',  color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
};

interface Props {
  category: AnnotationCategory;
  severity: AnnotationSeverity;
  size?: 'sm' | 'md';
}

export function CategoryTag({ category, severity, size = 'md' }: Props) {
  const cfg = SEVERITY_CONFIG[severity];
  const fs = size === 'sm' ? '0.68rem' : '0.75rem';
  const px = size === 'sm' ? '6px' : '8px';
  const py = size === 'sm' ? '2px' : '3px';

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: 100,
        fontSize: fs,
        fontWeight: 700,
        padding: `${py} ${px}`,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}>
        {cfg.label}
      </span>
      <span style={{
        background: '#f3f4f6',
        color: '#374151',
        borderRadius: 100,
        fontSize: fs,
        fontWeight: 600,
        padding: `${py} ${px}`,
        whiteSpace: 'nowrap',
      }}>
        {CATEGORY_LABEL[category]}
      </span>
    </div>
  );
}
