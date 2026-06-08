import { motion } from 'framer-motion';

interface Props {
  score: number;
}

function scoreColor(score: number): string {
  if (score >= 80) return '#059669';
  if (score >= 60) return '#d97706';
  return '#dc2626';
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Strong';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs work';
}

export function ScoreCircle({ score }: Props) {
  const color = scoreColor(score);
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        <svg width="96" height="96" role="img" aria-label={`Overall score: ${score} out of 100`}>
          <circle cx="48" cy="48" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <motion.circle
            cx="48" cy="48" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '48px 48px' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 600 }}>/100</span>
        </div>
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color }}>{scoreLabel(score)}</span>
    </div>
  );
}
