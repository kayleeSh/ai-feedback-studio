import { Confidence } from '../types';

const CONFIG: Record<Confidence, { label: string; fill: number; color: string }> = {
  high:   { label: 'High confidence',   fill: 100, color: '#059669' },
  medium: { label: 'Medium confidence', fill: 60,  color: '#d97706' },
  low:    { label: 'Low confidence',    fill: 30,  color: '#9ca3af' },
};

interface Props {
  confidence: Confidence;
}

export function ConfidenceBar({ confidence }: Props) {
  const cfg = CONFIG[confidence];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          AI Confidence
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>
      <div
        role="meter"
        aria-valuenow={cfg.fill}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={cfg.label}
        style={{ height: 6, background: '#f3f4f6', borderRadius: 100, overflow: 'hidden' }}
      >
        <div
          style={{
            width: `${cfg.fill}%`,
            height: '100%',
            background: cfg.color,
            borderRadius: 100,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}
