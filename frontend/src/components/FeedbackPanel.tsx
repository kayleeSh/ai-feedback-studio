import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Annotation, AnalysisResult, AnnotationCategory, AnnotationSeverity } from '../types';
import { CategoryTag } from './CategoryTag';
import { ConfidenceBar } from './ConfidenceBar';
import { ScoreCircle } from './ScoreCircle';

const SEVERITY_DOT: Record<AnnotationSeverity, string> = {
  critical:   '#dc2626',
  warning:    '#d97706',
  suggestion: '#d97706',
};

const CATEGORY_ORDER: AnnotationCategory[] = ['clarity', 'tone', 'structure', 'word_choice', 'conciseness', 'grammar'];

const CATEGORY_LABEL: Record<AnnotationCategory, string> = {
  clarity:     'Clarity',
  tone:        'Tone',
  structure:   'Structure',
  word_choice: 'Word Choice',
  conciseness: 'Conciseness',
  grammar:     'Grammar',
};

interface AnnotationListItemProps {
  annotation: Annotation;
  isSelected: boolean;
  onClick: () => void;
}

function AnnotationRow({ annotation, isSelected, onClick }: AnnotationListItemProps) {
  const [hovered, setHovered] = useState(false);
  const active = isSelected || hovered;

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        textAlign: 'left',
        background: active ? 'rgba(0,0,0,0.04)' : 'transparent',
        border: 'none',
        padding: '6px 8px',
        borderRadius: 5,
        cursor: 'pointer',
        transition: 'background 0.12s',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', gap: 9, alignItems: 'center', minWidth: 0 }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
          background: SEVERITY_DOT[annotation.severity],
        }} />
        <span style={{
          fontSize: '0.82rem', color: '#374151',
          fontWeight: isSelected ? 600 : 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {annotation.title}
        </span>
      </div>
      <svg
        width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#d97706' : '#d1d5db'}
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, transition: 'stroke 0.12s' }}
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
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
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#d97706', fontFamily: 'inherit', fontWeight: 500, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
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

      {/* Grouped annotation list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} aria-label="Issues by category">
        {CATEGORY_ORDER
          .map(cat => ({ cat, items: result.annotations.filter(a => a.category === cat) }))
          .filter(g => g.items.length > 0)
          .map(({ cat, items }) => (
              <div
                key={cat}
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 10,
                  padding: '10px 10px 6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', flexShrink: 0, color: '#18181b',
                  }}>
                    {CATEGORY_LABEL[cat]}
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
                  <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#9ca3af', flexShrink: 0 }}>
                    {items.length}
                  </span>
                </div>
                <div role="list">
                  {items.map(ann => (
                    <div key={ann.id} role="listitem">
                      <AnnotationRow
                        annotation={ann}
                        isSelected={ann.id === selectedId}
                        onClick={() => onSelect(ann)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        }
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
