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
  isHovered: boolean;
  onClick: () => void;
  onHover: (ann: Annotation | null) => void;
}

function AnnotationRow({ annotation, isSelected, isHovered, onClick, onHover }: AnnotationListItemProps) {
  const [hovered, setHovered] = useState(false);
  const active = isSelected || hovered || isHovered;

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      onMouseEnter={() => { setHovered(true); onHover(annotation); }}
      onMouseLeave={() => { setHovered(false); onHover(null); }}
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
  hoveredId: string | null;
  onSelect: (ann: Annotation) => void;
  onHover: (ann: Annotation | null) => void;
}

function Overview({ result, selectedId, hoveredId, onSelect, onHover }: OverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Score */}
      <div style={{ marginBottom: 20 }}>
        <ScoreCircle score={result.overallScore} />
        <div style={{ height: 1, background: '#f0f0f0', margin: '12px 0' }} />
        <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.65, margin: '0 0 12px' }}>
          {result.summary}
        </p>
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 10 }}>
          {result.strengths.map((s, i) => (
            <div key={`s-${i}`} style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, flexShrink: 0, lineHeight: 1.5 }}>+</span>
              <span style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
          {result.focusAreas.map((f, i) => (
            <div key={`f-${i}`} style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700, flexShrink: 0, lineHeight: 1.5 }}>–</span>
              <span style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>{f}</span>
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
                        isHovered={ann.id === hoveredId}
                        onClick={() => onSelect(ann)}
                        onHover={onHover}
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

const ghostLine = (w = '100%', h = 11) => ({
  height: h, width: w, borderRadius: 3,
  background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
  marginBottom: 7,
} as React.CSSProperties);

interface Props {
  result: AnalysisResult | null;
  selectedAnnotation: Annotation | null;
  hoveredId: string | null;
  onSelect: (ann: Annotation | null) => void;
  onHover: (ann: Annotation | null) => void;
}

export function FeedbackPanel({ result, selectedAnnotation, hoveredId, onSelect, onHover }: Props) {
  if (!result) {
    return (
      <div style={{ padding: '24px 20px', height: '100%', overflowY: 'auto', opacity: 0.5 }}>
        <div style={{ height: 32, width: 100, borderRadius: 4, marginBottom: 6, background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.8s ease-in-out infinite' }} />
        <div style={ghostLine('55%', 10)} />
        <div style={{ height: 1, background: '#f0f0f0', margin: '12px 0' }} />
        <div style={ghostLine()} />
        <div style={ghostLine('88%')} />
        <div style={ghostLine('65%')} />
        <div style={{ height: 1, background: '#f3f4f6', margin: '10px 0 12px' }} />
        <div style={ghostLine('72%', 9)} />
        <div style={ghostLine('60%', 9)} />
        <div style={ghostLine('68%', 9)} />
        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 10, padding: '10px 10px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ height: 8, width: 52, borderRadius: 3, background: '#f0f0f0' }} />
            <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
          </div>
          <div style={ghostLine('80%', 9)} />
          <div style={ghostLine('55%', 9)} />
        </div>
        <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 10, padding: '10px 10px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ height: 8, width: 40, borderRadius: 3, background: '#f0f0f0' }} />
            <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
          </div>
          <div style={ghostLine('75%', 9)} />
        </div>
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
    <div className="panel-scroll" style={{ padding: '24px 20px', height: '100%', overflowY: 'auto' }}>
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
            hoveredId={hoveredId}
            onSelect={onSelect}
            onHover={onHover}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
