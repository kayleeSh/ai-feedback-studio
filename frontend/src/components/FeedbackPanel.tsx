import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Annotation, AnalysisResult, AnnotationSeverity } from '../types';
import { CategoryTag } from './CategoryTag';
import { ConfidenceBar } from './ConfidenceBar';
import { ScoreCircle } from './ScoreCircle';

const SEVERITY_DOT: Record<AnnotationSeverity, string> = {
  critical:   '#dc2626',
  warning:    '#d97706',
  suggestion: '#4f46e5',
};

interface AnnotationListItemProps {
  annotation: Annotation;
  isSelected: boolean;
  onClick: () => void;
}

function AnnotationListItem({ annotation, isSelected, onClick }: AnnotationListItemProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      style={{
        width: '100%',
        textAlign: 'left',
        background: isSelected ? '#f8f9fb' : '#fff',
        border: `1px solid ${isSelected ? '#d1d5db' : '#e5e7eb'}`,
        borderLeft: `3px solid ${SEVERITY_DOT[annotation.severity]}`,
        borderRadius: 8,
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'all 0.12s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
          background: SEVERITY_DOT[annotation.severity],
        }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827', marginBottom: 2 }}>
            {annotation.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {annotation.text}
          </div>
        </div>
      </div>
    </button>
  );
}

interface DetailViewProps {
  annotation: Annotation;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onBack: () => void;
}

function DetailView({ annotation, index, total, onPrev, onNext, onBack }: DetailViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!annotation.suggestion) return;
    await navigator.clipboard.writeText(annotation.suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.18 }}
    >
      {/* Back + navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          onClick={onBack}
          aria-label="Back to all annotations"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#4f46e5', fontFamily: 'inherit', fontWeight: 500, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          ← Overview
        </button>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{index + 1} / {total}</span>
          <button onClick={onPrev} disabled={index === 0} aria-label="Previous annotation"
            style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', color: '#6b7280', fontSize: '0.75rem', fontFamily: 'inherit' }}
          >‹</button>
          <button onClick={onNext} disabled={index === total - 1} aria-label="Next annotation"
            style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', color: '#6b7280', fontSize: '0.75rem', fontFamily: 'inherit' }}
          >›</button>
        </div>
      </div>

      <CategoryTag category={annotation.category} severity={annotation.severity} />

      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '12px 0 8px' }}>
        {annotation.title}
      </h2>

      {/* Highlighted passage */}
      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 5 }}>
          Flagged passage
        </div>
        <p style={{ fontSize: '0.85rem', color: '#374151', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
          "{annotation.text}"
        </p>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginBottom: 14 }}>
        {annotation.feedback}
      </p>

      {/* Suggestion */}
      {annotation.suggestion && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#059669' }}>
              Suggested revision
            </span>
            <button
              onClick={handleCopy}
              aria-label="Copy suggestion to clipboard"
              style={{ background: 'none', border: '1px solid #86efac', borderRadius: 5, padding: '2px 8px', cursor: 'pointer', fontSize: '0.72rem', color: '#059669', fontFamily: 'inherit' }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#14532d', lineHeight: 1.6, margin: 0 }}>
            {annotation.suggestion}
          </p>
        </div>
      )}

      <ConfidenceBar confidence={annotation.confidence} />
    </motion.div>
  );
}

interface OverviewProps {
  result: AnalysisResult;
  selectedId: string | null;
  onSelect: (ann: Annotation) => void;
}

function Overview({ result, selectedId, onSelect }: OverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Score */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, padding: '16px', background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <ScoreCircle score={result.overallScore} />
        <div>
          <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.65, margin: 0 }}>
            {result.summary}
          </p>
        </div>
      </div>

      {/* Strengths & Focus */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#059669', marginBottom: 6 }}>
            Strengths
          </div>
          {result.strengths.map((s, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: '#14532d', lineHeight: 1.5, marginBottom: 3 }}>
              › {s}
            </div>
          ))}
        </div>
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: 6 }}>
            Focus areas
          </div>
          {result.focusAreas.map((f, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: '#7f1d1d', lineHeight: 1.5, marginBottom: 3 }}>
              › {f}
            </div>
          ))}
        </div>
      </div>

      {/* Annotation list */}
      <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 8 }}>
        {result.annotations.length} issue{result.annotations.length !== 1 ? 's' : ''} found
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} role="list" aria-label="Annotation list">
        {result.annotations.map(ann => (
          <div key={ann.id} role="listitem">
            <AnnotationListItem
              annotation={ann}
              isSelected={ann.id === selectedId}
              onClick={() => onSelect(ann)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface Props {
  result: AnalysisResult | null;
  selectedAnnotation: Annotation | null;
  onSelect: (ann: Annotation | null) => void;
}

export function FeedbackPanel({ result, selectedAnnotation, onSelect }: Props) {
  if (!result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✦</div>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
          Analyse your text to receive<br />inline feedback and suggestions
        </p>
      </div>
    );
  }

  const selectedIndex = selectedAnnotation
    ? result.annotations.findIndex(a => a.id === selectedAnnotation.id)
    : -1;

  const goTo = (index: number) => {
    const ann = result.annotations[index];
    if (ann) onSelect(ann);
  };

  return (
    <div style={{ padding: '24px 20px', height: '100%', overflowY: 'auto' }}>
      <AnimatePresence mode="wait">
        {selectedAnnotation && selectedIndex !== -1 ? (
          <DetailView
            key={selectedAnnotation.id}
            annotation={selectedAnnotation}
            index={selectedIndex}
            total={result.annotations.length}
            onPrev={() => goTo(selectedIndex - 1)}
            onNext={() => goTo(selectedIndex + 1)}
            onBack={() => onSelect(null)}
          />
        ) : (
          <Overview
            key="overview"
            result={result}
            selectedId={selectedAnnotation?.id ?? null}
            onSelect={onSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
