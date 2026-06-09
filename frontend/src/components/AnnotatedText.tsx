import { useMemo } from 'react';
import { Annotation, AnnotationSeverity } from '../types';

const UNDERLINE_COLOR: Record<AnnotationSeverity, string> = {
  critical:   '#dc2626',
  warning:    '#d97706',
  suggestion: '#d97706',
};

const HOVER_BG: Record<AnnotationSeverity, string> = {
  critical:   'rgba(220,38,38,0.08)',
  warning:    'rgba(217,119,6,0.08)',
  suggestion: 'rgba(217,119,6,0.08)',
};

interface Segment {
  type: 'text' | 'annotation';
  content: string;
  annotation?: Annotation;
}

function buildSegments(text: string, annotations: Annotation[]): Segment[] {
  const positioned = annotations
    .map(ann => {
      const idx = text.indexOf(ann.text);
      if (idx === -1) return null;
      return { ann, start: idx, end: idx + ann.text.length };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .sort((a, b) => a.start - b.start);

  // Remove overlapping — keep the first one found
  const clean: typeof positioned = [];
  let lastEnd = 0;
  for (const item of positioned) {
    if (item.start >= lastEnd) {
      clean.push(item);
      lastEnd = item.end;
    }
  }

  const segments: Segment[] = [];
  let cursor = 0;
  for (const { ann, start, end } of clean) {
    if (cursor < start) segments.push({ type: 'text', content: text.slice(cursor, start) });
    segments.push({ type: 'annotation', content: ann.text, annotation: ann });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ type: 'text', content: text.slice(cursor) });
  return segments;
}

interface Props {
  text: string;
  annotations: Annotation[];
  selectedId: string | null;
  revealedCount: number;
  onSelect: (ann: Annotation | null) => void;
}

export function AnnotatedText({ text, annotations, selectedId, revealedCount, onSelect }: Props) {
  const visibleAnnotations = annotations.slice(0, revealedCount);
  const segments = useMemo(
    () => buildSegments(text, visibleAnnotations),
    [text, visibleAnnotations]
  );

  return (
    <div
      className="annotated-text"
      style={{ whiteSpace: 'pre-wrap', lineHeight: 1.85, fontSize: '0.95rem', color: '#1f2937' }}
    >
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.content}</span>;
        }
        const ann = seg.annotation!;
        const isSelected = ann.id === selectedId;
        const color = UNDERLINE_COLOR[ann.severity];

        return (
          <mark
            key={i}
            tabIndex={0}
            role="button"
            aria-pressed={isSelected}
            aria-label={`${ann.severity}: ${ann.title}. Press Enter for details.`}
            onClick={() => onSelect(isSelected ? null : ann)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(isSelected ? null : ann);
              }
            }}
            style={{
              background: isSelected ? HOVER_BG[ann.severity] : 'transparent',
              color: 'inherit',
              borderBottom: `2px ${isSelected ? 'solid' : 'dashed'} ${color}`,
              borderRadius: 2,
              cursor: 'pointer',
              outline: 'none',
              padding: '1px 0',
              transition: 'background 0.15s',
            }}
            className={`annotation-mark severity-${ann.severity}`}
          >
            {seg.content}
          </mark>
        );
      })}
    </div>
  );
}
